package com.drcopad.copad.service;

import com.drcopad.copad.entity.*;
import com.drcopad.copad.repository.DocumentRepository;
import com.drcopad.copad.repository.LabResultRepository;
import com.drcopad.copad.repository.MedicationRepository;
import com.drcopad.copad.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;

/**
 * Documents belonging to a person's record.
 *
 * Upload stores the file and returns immediately; extraction runs afterwards,
 * because OCR on a scanned report takes long enough that holding the request
 * open would make uploading feel broken.
 *
 * Extracted values are never written into the record as fact. They are stored
 * unconfirmed and a person accepts them, since an OCR error is otherwise
 * indistinguishable from a real result.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class DocumentService {

    private final DocumentRepository documentRepository;
    private final LabResultRepository labResultRepository;
    private final UserRepository userRepository;
    private final FamilyService familyService;
    private final DocumentStorageService storage;
    private final DocumentExtractionService extraction;
    private final ConsentService consents;
    private final LabReportParser labParser;
    private final PrescriptionParser prescriptionParser;
    private final MedicationRepository medicationRepository;

    @Transactional(readOnly = true)
    public List<Document> list(Long memberId, Long userId) {
        familyService.requireMemberAccess(memberId, userId, false);
        return documentRepository
                .findByFamilyMemberIdAndDeletedAtIsNullOrderByDocumentDateDescIdDesc(memberId);
    }

    /** Loads a document, confirming the caller can reach the member who owns it. */
    @Transactional(readOnly = true)
    public Document require(Long documentId, Long userId, boolean forWrite) {
        Document document = documentRepository.findByIdAndDeletedAtIsNull(documentId)
                .orElseThrow(() -> new IllegalArgumentException("Document not found"));
        familyService.requireMemberAccess(document.getFamilyMember().getId(), userId, forWrite);
        return document;
    }

    @Transactional
    public Document upload(Long memberId, Long userId, MultipartFile file,
                           DocumentType type, String title, LocalDate documentDate,
                           String provider) throws IOException {
        FamilyMember member = familyService.requireMemberAccess(memberId, userId, true);

        DocumentStorageService.Stored stored = storage.store(memberId, file);

        // Re-uploading the same file is common when someone is unsure it
        // worked. Returning the existing document avoids a duplicate record and
        // a second extraction.
        if (stored.checksum() != null) {
            var existing = documentRepository
                    .findFirstByFamilyMemberIdAndChecksumSha256AndDeletedAtIsNull(
                            memberId, stored.checksum());
            if (existing.isPresent()) {
                storage.delete(stored.storageKey());
                log.info("Duplicate upload for member {}, returning existing document", memberId);
                return existing.get();
            }
        }

        Document document = new Document();
        document.setFamilyMember(member);
        document.setUploadedBy(userId == null ? null : userRepository.findById(userId).orElse(null));
        // The filename is not logged: it often carries a patient's name.
        document.setOriginalFilename(file.getOriginalFilename());
        document.setStorageKey(stored.storageKey());
        document.setContentType(stored.detectedType());
        document.setSizeBytes(stored.size());
        document.setChecksumSha256(stored.checksum());
        document.setDocumentType(type == null ? DocumentType.OTHER : type);
        document.setTitle(title != null && !title.isBlank() ? title : defaultTitle(file, type));
        document.setDocumentDate(documentDate);
        document.setProvider(provider);
        document.setExtractionStatus(ExtractionStatus.PENDING);

        Document saved = documentRepository.save(document);
        log.info("Stored document {} for member {} ({} bytes, {})",
                saved.getId(), memberId, stored.size(), stored.detectedType());
        return saved;
    }

    /**
     * Extracts text and, for lab reports, candidate values.
     *
     * Runs outside the upload request. Any failure is recorded on the document
     * rather than thrown: the file is still worth keeping and viewing even when
     * nothing could be read from it.
     */
    @Async
    @Transactional
    public void extractAsync(Long documentId) {
        Document document = documentRepository.findByIdAndDeletedAtIsNull(documentId).orElse(null);
        if (document == null) return;

        document.setExtractionStatus(ExtractionStatus.PROCESSING);
        documentRepository.save(document);

        try {
            boolean allowExternal = document.getUploadedBy() != null
                    && !consents.hasRefused(document.getUploadedBy().getId(), ConsentType.CROSS_BORDER_AI);
            String text = extraction.extractText(
                    storage.readAllBytes(document.getStorageKey()),
                    document.getContentType(), allowExternal);

            if (text == null || text.isBlank()) {
                // An image with no text layer is not a failure; there is simply
                // nothing to read without OCR.
                document.setExtractionStatus(ExtractionStatus.SKIPPED);
                if (!allowExternal) document.setExtractionError("AI_PROCESSING_DECLINED");
                documentRepository.save(document);
                return;
            }

            document.setExtractedText(text);
            document.setExtractionStatus(ExtractionStatus.COMPLETED);

            // Each document type is read by the parser built for it. Running a
            // lab table parser over a prescription would produce nonsense
            // values, and nonsense in a medical record is worse than a gap.
            if (document.getDocumentType() == DocumentType.LAB_RESULT) {
                storeCandidates(document, text);
            } else if (document.getDocumentType() == DocumentType.PRESCRIPTION) {
                storePrescribedMedications(document, text);
            }
            documentRepository.save(document);

        } catch (Exception e) {
            log.warn("Extraction failed for document {}: {}", documentId, e.getClass().getSimpleName());
            document.setExtractionStatus(ExtractionStatus.FAILED);
            document.setExtractionError(e.getClass().getSimpleName());
            documentRepository.save(document);
        }
    }

    private void storeCandidates(Document document, String text) {
        List<LabReportParser.ParsedResult> parsed = labParser.parse(text);

        for (LabReportParser.ParsedResult p : parsed) {
            LabResult result = new LabResult();
            result.setFamilyMember(document.getFamilyMember());
            result.setDocument(document);
            result.setAnalyte(p.analyte());
            result.setAnalyteKey(p.analyteKey());
            result.setValueNumeric(p.value());
            result.setUnit(p.unit());
            result.setReferenceLow(p.referenceLow());
            result.setReferenceHigh(p.referenceHigh());
            result.setAbnormalFlag(p.flag());
            result.setCollectedAt(document.getDocumentDate() == null
                    ? document.getCreatedAt()
                    : document.getDocumentDate().atStartOfDay());
            // Unconfirmed until a person accepts it.
            result.setConfirmed(false);
            labResultRepository.save(result);
        }
        log.info("Document {} produced {} candidate values", document.getId(), parsed.size());
    }

    /**
     * Medications read from a prescription, stored for review.
     *
     * Unconfirmed, and deliberately not marked active: an unreviewed row must
     * not reach the assistant or a medication list as though the person were
     * taking it.
     */
    private void storePrescribedMedications(Document document, String text) {
        List<PrescriptionParser.ParsedMedication> parsed = prescriptionParser.parse(text);

        for (PrescriptionParser.ParsedMedication p : parsed) {
            Medication medication = new Medication();
            medication.setFamilyMember(document.getFamilyMember());
            medication.setSourceDocumentId(document.getId());
            medication.setName(p.name());
            medication.setDoseAmount(p.doseAmount());
            medication.setDoseUnit(p.doseUnit());
            medication.setFrequency(p.frequency());
            medication.setRoute(p.route());
            medication.setPrescriber(document.getProvider());
            medication.setStartedOn(document.getDocumentDate());
            if (p.durationDays() != null && document.getDocumentDate() != null) {
                medication.setEndedOn(document.getDocumentDate().plusDays(p.durationDays()));
            }
            medication.setActive(false);
            medication.setConfirmed(false);
            medicationRepository.save(medication);
        }
        log.info("Document {} produced {} candidate medications", document.getId(), parsed.size());
    }

    @Transactional(readOnly = true)
    public List<Medication> pendingMedications(Long memberId, Long userId) {
        familyService.requireMemberAccess(memberId, userId, false);
        return medicationRepository
                .findByFamilyMemberIdAndConfirmedFalseAndDeletedAtIsNullOrderByIdDesc(memberId);
    }

    /**
     * Accepts a proposed medication, with any corrections.
     *
     * Confirming is also what makes it active: until a person says so, we do
     * not know the course was actually started.
     */
    @Transactional
    public Medication confirmMedication(Long medicationId, Long userId, Medication corrections) {
        Medication medication = medicationRepository.findByIdAndDeletedAtIsNull(medicationId)
                .orElseThrow(() -> new IllegalArgumentException("Medication not found"));
        familyService.requireMemberAccess(medication.getFamilyMember().getId(), userId, true);

        if (corrections != null) {
            if (corrections.getName() != null) medication.setName(corrections.getName());
            if (corrections.getDoseAmount() != null) medication.setDoseAmount(corrections.getDoseAmount());
            if (corrections.getDoseUnit() != null) medication.setDoseUnit(corrections.getDoseUnit());
            if (corrections.getFrequency() != null) medication.setFrequency(corrections.getFrequency());
            if (corrections.getRoute() != null) medication.setRoute(corrections.getRoute());
            if (corrections.getStartedOn() != null) medication.setStartedOn(corrections.getStartedOn());
            if (corrections.getEndedOn() != null) medication.setEndedOn(corrections.getEndedOn());
        }

        medication.setConfirmed(true);
        medication.setActive(true);
        medication.setConfirmedBy(userId == null ? null : userRepository.findById(userId).orElse(null));
        medication.setConfirmedAt(LocalDateTime.now());
        return medicationRepository.save(medication);
    }

    @Transactional
    public void rejectMedication(Long medicationId, Long userId) {
        Medication medication = medicationRepository.findByIdAndDeletedAtIsNull(medicationId)
                .orElseThrow(() -> new IllegalArgumentException("Medication not found"));
        familyService.requireMemberAccess(medication.getFamilyMember().getId(), userId, true);
        medication.setDeletedAt(LocalDateTime.now());
        medicationRepository.save(medication);
    }

    /**
     * A lab value typed in by a person.
     *
     * The reason this exists: a photographed report has no text layer, so
     * extraction reads nothing from it, and most reports here arrive as phone
     * photos. Without this the whole feature is unavailable to the people who
     * need it most.
     *
     * Confirmed on creation, because a person typed it deliberately - there is
     * no machine reading to review. It is marked MANUAL so the record can still
     * say where the number came from.
     */
    @Transactional
    public LabResult addManualResult(Long memberId, Long userId, LabResult input) {
        FamilyMember member = familyService.requireMemberAccess(memberId, userId, true);

        if (input.getAnalyte() == null || input.getAnalyte().isBlank()) {
            throw new IllegalArgumentException("The test name is required");
        }
        if (input.getValueNumeric() == null
                && (input.getValueText() == null || input.getValueText().isBlank())) {
            throw new IllegalArgumentException("A result value is required");
        }

        LabResult result = new LabResult();
        result.setFamilyMember(member);
        result.setAnalyte(input.getAnalyte().trim());
        // The same key extraction would produce, so a typed Hemoglobin charts
        // with an HGB read off a report rather than beside it.
        result.setAnalyteKey(labParser.canonicalKey(input.getAnalyte()));
        result.setValueNumeric(input.getValueNumeric());
        result.setValueText(input.getValueText());
        result.setUnit(input.getUnit());
        result.setReferenceLow(input.getReferenceLow());
        result.setReferenceHigh(input.getReferenceHigh());
        result.setReferenceText(input.getReferenceText());
        // Flagged only against a range the person actually supplied. Ranges
        // differ by laboratory and method, and inventing one would produce a
        // confident wrong verdict.
        result.setAbnormalFlag(flagFor(input.getValueNumeric(),
                input.getReferenceLow(), input.getReferenceHigh()));
        result.setCollectedAt(input.getCollectedAt() == null
                ? LocalDateTime.now() : input.getCollectedAt());

        result.setSource(LabResultSource.MANUAL);
        result.setConfirmed(true);
        result.setConfirmedBy(userId == null ? null : userRepository.findById(userId).orElse(null));
        result.setConfirmedAt(LocalDateTime.now());

        LabResult saved = labResultRepository.save(result);
        // The analyte is not logged: a test name can disclose a condition.
        log.info("Manual lab result {} recorded for member {}", saved.getId(), memberId);
        return saved;
    }

    private AbnormalFlag flagFor(BigDecimal value, BigDecimal low, BigDecimal high) {
        if (value == null || low == null || high == null) return null;
        if (value.compareTo(low) < 0) return AbnormalFlag.LOW;
        if (value.compareTo(high) > 0) return AbnormalFlag.HIGH;
        return AbnormalFlag.NORMAL;
    }

    @Transactional(readOnly = true)
    public List<LabResult> labResults(Long memberId, Long userId) {
        familyService.requireMemberAccess(memberId, userId, false);
        return labResultRepository.findByFamilyMemberIdAndDeletedAtIsNullOrderByCollectedAtDesc(memberId);
    }

    /** One analyte over time, which is what makes a result readable. */
    @Transactional(readOnly = true)
    public List<LabResult> labSeries(Long memberId, Long userId, String analyteKey) {
        familyService.requireMemberAccess(memberId, userId, false);
        return labResultRepository
                .findByFamilyMemberIdAndAnalyteKeyAndDeletedAtIsNullOrderByCollectedAtAsc(
                        memberId, analyteKey.toLowerCase(Locale.ROOT));
    }

    @Transactional(readOnly = true)
    public List<LabResult> pendingConfirmation(Long memberId, Long userId) {
        familyService.requireMemberAccess(memberId, userId, false);
        return labResultRepository.findByFamilyMemberIdAndConfirmedFalseAndDeletedAtIsNull(memberId);
    }

    @Transactional
    public LabResult confirm(Long resultId, Long userId, LabResult corrections) {
        LabResult result = labResultRepository.findByIdAndDeletedAtIsNull(resultId)
                .orElseThrow(() -> new IllegalArgumentException("Result not found"));
        familyService.requireMemberAccess(result.getFamilyMember().getId(), userId, true);

        // A person correcting a misread number is the point of the review step,
        // so corrections are accepted alongside the confirmation.
        if (corrections != null) {
            if (corrections.getValueNumeric() != null) result.setValueNumeric(corrections.getValueNumeric());
            if (corrections.getUnit() != null) result.setUnit(corrections.getUnit());
            if (corrections.getAnalyte() != null) result.setAnalyte(corrections.getAnalyte());
            if (corrections.getCollectedAt() != null) result.setCollectedAt(corrections.getCollectedAt());
        }

        result.setConfirmed(true);
        result.setConfirmedBy(userId == null ? null : userRepository.findById(userId).orElse(null));
        result.setConfirmedAt(LocalDateTime.now());
        return labResultRepository.save(result);
    }

    @Transactional
    public void rejectResult(Long resultId, Long userId) {
        LabResult result = labResultRepository.findByIdAndDeletedAtIsNull(resultId)
                .orElseThrow(() -> new IllegalArgumentException("Result not found"));
        familyService.requireMemberAccess(result.getFamilyMember().getId(), userId, true);
        result.setDeletedAt(LocalDateTime.now());
        labResultRepository.save(result);
    }

    @Transactional
    public void delete(Long documentId, Long userId) {
        Document document = require(documentId, userId, true);
        document.setDeletedAt(LocalDateTime.now());
        documentRepository.save(document);
        // The file goes too. Keeping bytes a person asked to delete would be
        // the wrong default for medical data.
        storage.delete(document.getStorageKey());
    }

    private String defaultTitle(MultipartFile file, DocumentType type) {
        String name = file.getOriginalFilename();
        if (name != null && !name.isBlank()) {
            int dot = name.lastIndexOf('.');
            return dot > 0 ? name.substring(0, dot) : name;
        }
        return (type == null ? DocumentType.OTHER : type).name();
    }
}
