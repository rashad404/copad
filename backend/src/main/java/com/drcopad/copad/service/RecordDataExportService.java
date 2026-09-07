package com.drcopad.copad.service;

import com.drcopad.copad.entity.*;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.util.*;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

/**
 * Everything held about one person, in a form they can keep.
 *
 * A person is entitled to their record, and to a copy that is still useful once
 * it leaves here. That rules out a JSON file full of storage keys: the documents
 * they uploaded are the part they are most likely to need, so the export is an
 * archive with the files in it, not a manifest describing files they cannot
 * reach.
 *
 * Readable rather than a database dump. Someone opening this at a clinic should
 * be able to make sense of it without our schema.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class RecordDataExportService {

    private final FamilyService familyService;
    private final ClinicalRecordService records;
    private final VitalService vitals;
    private final DocumentService documents;
    private final DocumentStorageService storage;

    private final ObjectMapper json = new ObjectMapper()
            .registerModule(new JavaTimeModule())
            .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS)
            .setSerializationInclusion(JsonInclude.Include.NON_NULL)
            .enable(SerializationFeature.INDENT_OUTPUT);

    /**
     * A ZIP holding the record as JSON and every document as its own file.
     *
     * Read access is enough. Exporting is not a change to the record, and a
     * VIEWER who can already read every value on screen gains nothing they did
     * not have by receiving the same values in a file.
     */
    @Transactional(readOnly = true)
    public byte[] export(Long memberId, Long userId) {
        FamilyMember member = familyService.requireMemberAccess(memberId, userId, false);

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        try (ZipOutputStream zip = new ZipOutputStream(out)) {

            Map<String, Object> record = new LinkedHashMap<>();
            record.put("exportedAt", LocalDateTime.now());
            record.put("person", person(member));
            record.put("allergies", records.allergies(memberId, userId).stream()
                    .map(this::allergy).toList());
            record.put("medications", records.medications(memberId, userId).stream()
                    .map(this::medication).toList());
            record.put("conditions", records.conditions(memberId, userId).stream()
                    .map(this::condition).toList());
            record.put("immunizations", records.immunizations(memberId, userId).stream()
                    .map(this::immunization).toList());
            record.put("vitals", vitals.recent(memberId, userId).stream()
                    .map(this::vital).toList());
            record.put("labResults", documents.labResults(memberId, userId).stream()
                    .map(this::labResult).toList());

            List<Document> docs = documents.list(memberId, userId);

            // The audit trail comes too. "Who changed this and when" is part of
            // the record, not our private bookkeeping about it.
            record.put("changeHistory", records.history(memberId, userId).stream()
                    .map(this::revision).toList());

            record.put("notes", List.of(
                    "This is the record azdoc holds for this person.",
                    "IMPORTANT: an entry with \"confirmed\": false has not been reviewed by "
                            + "anyone. It was read from a document automatically and may be "
                            + "wrong. Do not treat it as a result until it has been checked "
                            + "against the original, which is included under documents/.",
                    "\"source\": MANUAL means a person typed the value in; EXTRACTED means it "
                            + "was read from a document.",
                    "Reference ranges are the laboratory's own, as printed on each report, "
                            + "and differ between laboratories.",
                    "The record is self-reported and may be incomplete. An empty section "
                            + "means nothing was recorded, not that there is nothing.",
                    "Conversations with the assistant are not included; they belong to a "
                            + "session rather than to this person's record."));


            Set<String> used = new HashSet<>();
            Map<Long, String> writtenAs = new LinkedHashMap<>();
            for (Document doc : docs) {
                try {
                    byte[] bytes = storage.readAllBytes(doc.getStorageKey());
                    String name = fileName(doc, used);
                    write(zip, "documents/" + name, bytes);
                    writtenAs.put(doc.getId(), "documents/" + name);
                } catch (Exception e) {
                    // One missing file must not cost the person the rest of
                    // their record.
                    log.warn("Could not include document {} in the export: {}",
                            doc.getId(), e.getClass().getSimpleName());
                }
            }

            // Written last, so each document points at the name the archive
            // actually contains rather than at a title that may have been
            // renamed for uniqueness or stripped of punctuation.
            record.put("documents", docs.stream()
                    .map(d -> document(d, writtenAs.get(d.getId()))).toList());
            write(zip, "record.json", json.writeValueAsBytes(record));

        } catch (Exception e) {
            throw new IllegalStateException("Could not build the export", e);
        }

        log.info("Exported the record for member {}", memberId);
        return out.toByteArray();
    }

    private void write(ZipOutputStream zip, String name, byte[] bytes) throws Exception {
        zip.putNextEntry(new ZipEntry(name));
        zip.write(bytes);
        zip.closeEntry();
    }

    /** A readable name, kept unique, and never one that escapes the archive. */
    private String fileName(Document doc, Set<String> used) {
        String base = doc.getTitle() == null || doc.getTitle().isBlank()
                ? "document-" + doc.getId() : doc.getTitle();
        base = base.replaceAll("[^\\p{L}\\p{N} ._-]", "_").trim();
        if (base.isEmpty()) base = "document-" + doc.getId();

        String ext = switch (doc.getContentType() == null ? "" : doc.getContentType()) {
            case "application/pdf" -> ".pdf";
            case "image/jpeg" -> ".jpg";
            case "image/png" -> ".png";
            case "image/webp" -> ".webp";
            case "image/heic" -> ".heic";
            case "image/tiff" -> ".tif";
            case "text/plain" -> ".txt";
            default -> "";
        };

        String name = base + ext;
        int n = 2;
        while (!used.add(name)) {
            name = base + " (" + n++ + ")" + ext;
        }
        return name;
    }

    private Map<String, Object> person(FamilyMember m) {
        Map<String, Object> out = new LinkedHashMap<>();
        out.put("name", m.getFullName());
        out.put("dateOfBirth", m.getDateOfBirth());
        out.put("biologicalSex", m.getBiologicalSex());
        out.put("relationship", m.getRelationship());
        return out;
    }

    private Map<String, Object> allergy(Allergy a) {
        Map<String, Object> out = new LinkedHashMap<>();
        out.put("allergen", a.getAllergen());
        out.put("type", a.getAllergenType());
        out.put("severity", a.getSeverity());
        out.put("reaction", a.getReaction());
        out.put("active", a.isActive());
        out.put("recordedAt", a.getCreatedAt());
        return out;
    }

    private Map<String, Object> medication(Medication m) {
        Map<String, Object> out = new LinkedHashMap<>();
        out.put("name", m.getName());
        out.put("dose", m.getDoseLabel());
        out.put("frequency", m.getFrequency());
        out.put("route", m.getRoute());
        out.put("startedOn", m.getStartedOn());
        out.put("endedOn", m.getEndedOn());
        out.put("active", m.isActive());
        out.put("prescriber", m.getPrescriber());
        out.put("confirmed", m.isConfirmed());
        return out;
    }

    private Map<String, Object> condition(MedicalCondition c) {
        Map<String, Object> out = new LinkedHashMap<>();
        out.put("label", c.getLabel());
        out.put("status", c.getStatus());
        out.put("onsetDate", c.getOnsetDate());
        out.put("resolvedDate", c.getResolvedDate());
        return out;
    }

    private Map<String, Object> immunization(Immunization i) {
        Map<String, Object> out = new LinkedHashMap<>();
        out.put("vaccine", i.getVaccine());
        out.put("administeredOn", i.getAdministeredOn());
        out.put("doseNumber", i.getDoseNumber());
        return out;
    }

    private Map<String, Object> vital(VitalReading v) {
        Map<String, Object> out = new LinkedHashMap<>();
        out.put("type", v.getVitalType());
        out.put("value", v.getValueCanonical());
        out.put("unit", v.getUnitCanonical());
        out.put("measuredAt", v.getMeasuredAt());
        out.put("flag", v.getAbnormalFlag());
        out.put("source", v.getSource());
        return out;
    }

    private Map<String, Object> labResult(LabResult r) {
        Map<String, Object> out = new LinkedHashMap<>();
        out.put("test", r.getAnalyte());
        out.put("result", r.getDisplayValue());
        out.put("referenceRange", r.getReferenceLabel());
        out.put("flag", r.getAbnormalFlag());
        out.put("collectedAt", r.getCollectedAt());
        out.put("confirmed", r.isConfirmed());
        out.put("source", r.getSource());
        return out;
    }

    private Map<String, Object> document(Document d, String fileInArchive) {
        Map<String, Object> out = new LinkedHashMap<>();
        out.put("title", d.getTitle());
        out.put("type", d.getDocumentType());
        out.put("date", d.getDocumentDate());
        out.put("provider", d.getProvider());
        out.put("uploadedAt", d.getCreatedAt());
        // Null when the file could not be read; the entry still records that
        // the document existed.
        out.put("file", fileInArchive);
        return out;
    }

    private Map<String, Object> revision(RecordRevision r) {
        Map<String, Object> out = new LinkedHashMap<>();
        out.put("recordType", r.getRecordType());
        out.put("action", r.getAction());
        out.put("at", r.getCreatedAt());
        return out;
    }
}
