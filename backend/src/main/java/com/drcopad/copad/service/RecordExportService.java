package com.drcopad.copad.service;

import com.drcopad.copad.entity.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

/**
 * A one-page summary to hand a doctor.
 *
 * Ordered by what matters in a consultation rather than by how the data is
 * stored: allergies first because they change what can be prescribed, then
 * current medications, then conditions, then recent measurements.
 *
 * Only current information appears. A resolved condition or a discontinued drug
 * on a handout invites a decision based on something that is no longer true.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class RecordExportService {

    private static final DateTimeFormatter DATE = DateTimeFormatter.ofPattern("d MMM yyyy");
    private static final float MARGIN = 50;
    private static final float WIDTH = PDRectangle.A4.getWidth() - (MARGIN * 2);

    private final FamilyService familyService;
    private final ClinicalRecordService records;
    private final VitalService vitals;

    /** Tracks the cursor so sections can be appended without manual arithmetic. */
    private static final class Cursor {
        PDPageContentStream stream;
        PDPage page;
        float y;
    }

    @Transactional(readOnly = true)
    public byte[] summaryPdf(Long memberId, Long userId) {
        FamilyMember member = familyService.requireMemberAccess(memberId, userId, false);

        try (PDDocument document = new PDDocument();
             ByteArrayOutputStream out = new ByteArrayOutputStream()) {

            Cursor c = new Cursor();
            newPage(document, c);

            header(c, member);

            // Allergies lead. A prescriber reading this needs them before
            // anything else, and a critical one is called out explicitly.
            List<Allergy> allergies = records.allergies(memberId, userId).stream()
                    .filter(Allergy::isActive).toList();
            section(c, "Allergies");
            if (allergies.isEmpty()) {
                // "None recorded" is not "no allergies", and the difference matters.
                line(c, "None recorded.", false);
            } else {
                for (Allergy a : allergies) {
                    String detail = a.getAllergen()
                            + (a.getSeverity() == null ? "" : "  [" + a.getSeverity() + "]")
                            + (a.getReaction() == null ? "" : "  - " + a.getReaction());
                    line(c, detail, a.isCritical());
                }
            }

            List<Medication> medications = records.medications(memberId, userId).stream()
                    .filter(Medication::isActive).toList();
            section(c, "Current medications");
            if (medications.isEmpty()) {
                line(c, "None recorded.", false);
            } else {
                for (Medication m : medications) {
                    StringBuilder sb = new StringBuilder(m.getName());
                    if (m.getDoseLabel() != null) sb.append("  ").append(m.getDoseLabel());
                    if (m.getFrequency() != null) sb.append("  ").append(m.getFrequency());
                    if (m.getStartedOn() != null) sb.append("  (since ").append(m.getStartedOn().format(DATE)).append(")");
                    line(c, sb.toString(), false);
                }
            }

            List<MedicalCondition> conditions = records.conditions(memberId, userId).stream()
                    .filter(MedicalCondition::isCurrent).toList();
            section(c, "Active conditions");
            if (conditions.isEmpty()) {
                line(c, "None recorded.", false);
            } else {
                for (MedicalCondition condition : conditions) {
                    StringBuilder sb = new StringBuilder(condition.getLabel());
                    if (condition.getIcd10Code() != null) sb.append("  (").append(condition.getIcd10Code()).append(")");
                    if (condition.getOnsetDate() != null) sb.append("  since ").append(condition.getOnsetDate().format(DATE));
                    if (condition.getStatus() == ConditionStatus.UNCONFIRMED) sb.append("  [unconfirmed]");
                    line(c, sb.toString(), false);
                }
            }

            section(c, "Recent measurements");
            var latest = vitals.latestByType(memberId, userId);
            if (latest.isEmpty()) {
                line(c, "None recorded.", false);
            } else {
                // A loop rather than forEach: line() throws IOException, which
                // a lambda cannot propagate.
                for (var entry : latest.entrySet()) {
                    VitalReading reading = entry.getValue();
                    String flag = reading.getAbnormalFlag() == null
                            || !reading.getAbnormalFlag().isAbnormal()
                            ? "" : "  [" + reading.getAbnormalFlag() + "]";
                    line(c, String.format("%s: %s %s  (%s)%s",
                            entry.getKey(),
                            reading.getValueCanonical().stripTrailingZeros().toPlainString(),
                            reading.getUnitCanonical(),
                            reading.getMeasuredAt().toLocalDate().format(DATE), flag),
                            reading.getAbnormalFlag() != null && reading.getAbnormalFlag().isCritical());
                }
            }

            List<Immunization> immunizations = records.immunizations(memberId, userId);
            if (!immunizations.isEmpty()) {
                section(c, "Immunizations");
                for (Immunization i : immunizations) {
                    line(c, i.getVaccine()
                            + (i.getDoseNumber() == null ? "" : "  dose " + i.getDoseNumber())
                            + (i.getAdministeredOn() == null ? "" : "  " + i.getAdministeredOn().format(DATE)),
                            false);
                }
            }

            footer(c);
            c.stream.close();

            document.save(out);
            return out.toByteArray();
        } catch (IOException e) {
            log.error("Failed to build record summary PDF: {}", e.getMessage());
            throw new IllegalStateException("Could not generate the summary", e);
        }
    }

    private void newPage(PDDocument document, Cursor c) throws IOException {
        if (c.stream != null) c.stream.close();
        c.page = new PDPage(PDRectangle.A4);
        document.addPage(c.page);
        c.stream = new PDPageContentStream(document, c.page);
        c.y = PDRectangle.A4.getHeight() - MARGIN;
    }

    private void header(Cursor c, FamilyMember member) throws IOException {
        text(c, member.getFullName(), PDType1Font.HELVETICA_BOLD, 18);
        c.y -= 6;

        StringBuilder meta = new StringBuilder();
        if (member.getDateOfBirth() != null) {
            meta.append("Born ").append(member.getDateOfBirth().format(DATE));
            if (member.getAgeYears() != null) meta.append("  (age ").append(member.getAgeYears()).append(")");
        }
        if (member.getBiologicalSex() != null) meta.append("   Sex: ").append(member.getBiologicalSex());
        if (member.getBloodType() != null) meta.append("   Blood type: ").append(member.getBloodType());
        if (!meta.isEmpty()) text(c, meta.toString(), PDType1Font.HELVETICA, 10);

        text(c, "Summary generated " + LocalDate.now().format(DATE) + " from azdoc",
                PDType1Font.HELVETICA_OBLIQUE, 9);
        c.y -= 10;
    }

    private void section(Cursor c, String title) throws IOException {
        c.y -= 12;
        text(c, title.toUpperCase(), PDType1Font.HELVETICA_BOLD, 11);
        c.y -= 2;
    }

    private void line(Cursor c, String value, boolean emphasise) throws IOException {
        text(c, (emphasise ? "! " : "  ") + value,
                emphasise ? PDType1Font.HELVETICA_BOLD : PDType1Font.HELVETICA, 10);
    }

    private void footer(Cursor c) throws IOException {
        c.y -= 20;
        text(c, "This is a self-reported record kept by the patient. It is not a clinical "
                + "document and has not been verified by a clinician.",
                PDType1Font.HELVETICA_OBLIQUE, 8);
    }

    private void text(Cursor c, String value, PDType1Font font, float size) throws IOException {
        if (value == null || value.isBlank()) return;

        // PDFBox's standard fonts are WinAnsi; Azerbaijani characters outside
        // that set would throw mid-render, so they are transliterated rather
        // than failing the export.
        String safe = sanitise(value);

        for (String chunk : wrap(safe, font, size)) {
            c.stream.beginText();
            c.stream.setFont(font, size);
            c.stream.newLineAtOffset(MARGIN, c.y);
            c.stream.showText(chunk);
            c.stream.endText();
            c.y -= size + 4;
        }
    }

    private String sanitise(String value) {
        return value
                .replace("ə", "e").replace("Ə", "E")
                .replace("ı", "i").replace("İ", "I")
                .replace("ğ", "g").replace("Ğ", "G")
                .replace("ş", "s").replace("Ş", "S")
                .replace("ç", "c").replace("Ç", "C")
                .replace("ö", "o").replace("Ö", "O")
                .replace("ü", "u").replace("Ü", "U")
                .replaceAll("[^\\x20-\\x7E]", "");
    }

    private List<String> wrap(String value, PDType1Font font, float size) throws IOException {
        List<String> lines = new java.util.ArrayList<>();
        StringBuilder current = new StringBuilder();

        for (String word : value.split(" ")) {
            String candidate = current.isEmpty() ? word : current + " " + word;
            if (font.getStringWidth(candidate) / 1000 * size > WIDTH && !current.isEmpty()) {
                lines.add(current.toString());
                current = new StringBuilder(word);
            } else {
                current = new StringBuilder(candidate);
            }
        }
        if (!current.isEmpty()) lines.add(current.toString());
        return lines;
    }
}
