package com.drcopad.copad.controller;

import com.drcopad.copad.entity.*;
import com.drcopad.copad.service.DocumentService;
import com.drcopad.copad.service.DocumentStorageService;
import lombok.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * A member's documents and the values read from them.
 *
 * The content endpoint is the reason this exists: files used to sit in
 * public_html where the web server served them to anyone with the URL. Nothing
 * here is reachable without an access check.
 */
@Slf4j
@RestController
@RequestMapping("/api/members/{memberId}/documents")
@RequiredArgsConstructor
public class DocumentController {

    private final DocumentService documents;
    private final DocumentStorageService storage;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class DocumentDTO {
        private Long id;
        private String title;
        private DocumentType documentType;
        private LocalDate documentDate;
        private String provider;
        private String contentType;
        private Long sizeBytes;
        private ExtractionStatus extractionStatus;
        private boolean hasText;
        private String notes;
        private LocalDateTime createdAt;

        static DocumentDTO from(Document d) {
            return DocumentDTO.builder()
                    .id(d.getId()).title(d.getTitle()).documentType(d.getDocumentType())
                    .documentDate(d.getDocumentDate()).provider(d.getProvider())
                    .contentType(d.getContentType()).sizeBytes(d.getSizeBytes())
                    .extractionStatus(d.getExtractionStatus())
                    .hasText(d.getExtractedText() != null && !d.getExtractedText().isBlank())
                    .notes(d.getNotes()).createdAt(d.getCreatedAt())
                    .build();
        }
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class LabResultDTO {
        private Long id;
        private Long documentId;
        private String analyte;
        private String analyteKey;
        private BigDecimal value;
        private String valueText;
        private String unit;
        private String displayValue;
        private String referenceLabel;
        private AbnormalFlag abnormalFlag;
        private boolean abnormal;
        private LocalDateTime collectedAt;
        /** False means extracted but not yet accepted by a person. */
        private boolean confirmed;

        static LabResultDTO from(LabResult r) {
            return LabResultDTO.builder()
                    .id(r.getId())
                    .documentId(r.getDocument() == null ? null : r.getDocument().getId())
                    .analyte(r.getAnalyte()).analyteKey(r.getAnalyteKey())
                    .value(r.getValueNumeric()).valueText(r.getValueText()).unit(r.getUnit())
                    .displayValue(r.getDisplayValue()).referenceLabel(r.getReferenceLabel())
                    .abnormalFlag(r.getAbnormalFlag())
                    .abnormal(r.getAbnormalFlag() != null && r.getAbnormalFlag().isAbnormal())
                    .collectedAt(r.getCollectedAt()).confirmed(r.isConfirmed())
                    .build();
        }
    }

    /** A medication read from a prescription, awaiting review. */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ProposedMedicationDTO {
        private Long id;
        private Long sourceDocumentId;
        private String name;
        private BigDecimal doseAmount;
        private String doseUnit;
        private String doseLabel;
        private String frequency;
        private MedicationRoute route;
        private LocalDate startedOn;
        private LocalDate endedOn;
        private String prescriber;
        /** False means read from a document and not yet accepted by a person. */
        private boolean confirmed;

        static ProposedMedicationDTO from(Medication m) {
            return ProposedMedicationDTO.builder()
                    .id(m.getId()).sourceDocumentId(m.getSourceDocumentId())
                    .name(m.getName()).doseAmount(m.getDoseAmount()).doseUnit(m.getDoseUnit())
                    .doseLabel(m.getDoseLabel()).frequency(m.getFrequency()).route(m.getRoute())
                    .startedOn(m.getStartedOn()).endedOn(m.getEndedOn())
                    .prescriber(m.getPrescriber()).confirmed(m.isConfirmed())
                    .build();
        }
    }

    @GetMapping
    public List<DocumentDTO> list(@PathVariable Long memberId,
                                  @AuthenticationPrincipal User user) {
        return documents.list(memberId, user.getId()).stream().map(DocumentDTO::from).toList();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public DocumentDTO upload(@PathVariable Long memberId,
                              @RequestParam("file") MultipartFile file,
                              @RequestParam(required = false) DocumentType documentType,
                              @RequestParam(required = false) String title,
                              @RequestParam(required = false)
                              @org.springframework.format.annotation.DateTimeFormat(iso =
                                      org.springframework.format.annotation.DateTimeFormat.ISO.DATE)
                              LocalDate documentDate,
                              @RequestParam(required = false) String provider,
                              @AuthenticationPrincipal User user) throws IOException {
        Document saved = documents.upload(memberId, user.getId(), file,
                documentType, title, documentDate, provider);
        // Extraction continues after the response; the client polls the status.
        documents.extractAsync(saved.getId());
        return DocumentDTO.from(saved);
    }

    /**
     * The file itself.
     *
     * Inline rather than an attachment: a person checking their own report
     * wants to look at it, not save it.
     */
    @GetMapping("/{documentId}/content")
    public ResponseEntity<InputStreamResource> content(@PathVariable Long memberId,
                                                       @PathVariable Long documentId,
                                                       @AuthenticationPrincipal User user)
            throws IOException {
        Document document = documents.require(documentId, user.getId(), false);
        var stream = storage.read(document.getStorageKey());

        return ResponseEntity.ok()
                .contentType(document.getContentType() == null
                        ? MediaType.APPLICATION_OCTET_STREAM
                        : MediaType.parseMediaType(document.getContentType()))
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "inline; filename=\"" + safeName(document) + "\"")
                // Patient data must not sit in a shared cache.
                .header(HttpHeaders.CACHE_CONTROL, "private, no-store")
                .body(new InputStreamResource(stream));
    }

    @DeleteMapping("/{documentId}")
    public ResponseEntity<Void> delete(@PathVariable Long memberId,
                                       @PathVariable Long documentId,
                                       @AuthenticationPrincipal User user) {
        documents.delete(documentId, user.getId());
        return ResponseEntity.noContent().build();
    }

    // --- Lab results -------------------------------------------------------

    @GetMapping("/lab-results")
    public List<LabResultDTO> labResults(@PathVariable Long memberId,
                                         @AuthenticationPrincipal User user) {
        return documents.labResults(memberId, user.getId()).stream()
                .map(LabResultDTO::from).toList();
    }

    /** One analyte over time. */
    @GetMapping("/lab-results/series/{analyteKey}")
    public List<LabResultDTO> labSeries(@PathVariable Long memberId,
                                        @PathVariable String analyteKey,
                                        @AuthenticationPrincipal User user) {
        return documents.labSeries(memberId, user.getId(), analyteKey).stream()
                .map(LabResultDTO::from).toList();
    }

    /** Extracted but not yet accepted, which is what the review screen shows. */
    @GetMapping("/lab-results/pending")
    public List<LabResultDTO> pending(@PathVariable Long memberId,
                                      @AuthenticationPrincipal User user) {
        return documents.pendingConfirmation(memberId, user.getId()).stream()
                .map(LabResultDTO::from).toList();
    }

    @PostMapping("/lab-results/{resultId}/confirm")
    public LabResultDTO confirm(@PathVariable Long memberId,
                                @PathVariable Long resultId,
                                @RequestBody(required = false) LabResultDTO corrections,
                                @AuthenticationPrincipal User user) {
        LabResult patch = null;
        if (corrections != null) {
            patch = new LabResult();
            patch.setValueNumeric(corrections.getValue());
            patch.setUnit(corrections.getUnit());
            patch.setAnalyte(corrections.getAnalyte());
            patch.setCollectedAt(corrections.getCollectedAt());
        }
        return LabResultDTO.from(documents.confirm(resultId, user.getId(), patch));
    }

    @DeleteMapping("/lab-results/{resultId}")
    public ResponseEntity<Void> reject(@PathVariable Long memberId,
                                       @PathVariable Long resultId,
                                       @AuthenticationPrincipal User user) {
        documents.rejectResult(resultId, user.getId());
        return ResponseEntity.noContent().build();
    }

    // --- Medications read from a prescription ---------------------------------

    /** Proposals from an uploaded prescription, which the review screen shows. */
    @GetMapping("/medications/pending")
    public List<ProposedMedicationDTO> pendingMedications(@PathVariable Long memberId,
                                                          @AuthenticationPrincipal User user) {
        return documents.pendingMedications(memberId, user.getId()).stream()
                .map(ProposedMedicationDTO::from).toList();
    }

    @PostMapping("/medications/{medicationId}/confirm")
    public ProposedMedicationDTO confirmMedication(
            @PathVariable Long memberId,
            @PathVariable Long medicationId,
            @RequestBody(required = false) ProposedMedicationDTO corrections,
            @AuthenticationPrincipal User user) {

        Medication patch = null;
        if (corrections != null) {
            // A person correcting a misread dose is the point of the review
            // step, so corrections arrive with the confirmation.
            patch = new Medication();
            patch.setName(corrections.getName());
            patch.setDoseAmount(corrections.getDoseAmount());
            patch.setDoseUnit(corrections.getDoseUnit());
            patch.setFrequency(corrections.getFrequency());
            patch.setRoute(corrections.getRoute());
            patch.setStartedOn(corrections.getStartedOn());
            patch.setEndedOn(corrections.getEndedOn());
        }
        return ProposedMedicationDTO.from(
                documents.confirmMedication(medicationId, user.getId(), patch));
    }

    @DeleteMapping("/medications/{medicationId}")
    public ResponseEntity<Void> rejectMedication(@PathVariable Long memberId,
                                                 @PathVariable Long medicationId,
                                                 @AuthenticationPrincipal User user) {
        documents.rejectMedication(medicationId, user.getId());
        return ResponseEntity.noContent().build();
    }

    /** Never the original filename: it commonly carries the patient's name. */
    private String safeName(Document d) {
        String base = d.getTitle() == null ? "document" : d.getTitle();
        String ext = switch (d.getContentType() == null ? "" : d.getContentType()) {
            case "application/pdf" -> ".pdf";
            case "image/jpeg" -> ".jpg";
            case "image/png" -> ".png";
            case "image/webp" -> ".webp";
            case "text/plain" -> ".txt";
            default -> "";
        };
        return base.replaceAll("[^A-Za-z0-9 ._-]", "_") + ext;
    }
}
