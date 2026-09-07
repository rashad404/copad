package com.drcopad.copad.service;

import com.drcopad.copad.entity.*;
import com.drcopad.copad.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

/**
 * One chronological feed across every kind of record.
 *
 * Each record type already has its own list, but a person does not experience
 * their health as four separate lists: "started this medication, then the
 * headaches began, then blood pressure rose" is only visible when the types are
 * interleaved by date.
 *
 * The feed is assembled on read rather than maintained as a table. A projection
 * would need updating from five places and would drift the first time one of
 * them forgot.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class TimelineService {

    private final MedicalConditionRepository conditionRepository;
    private final AllergyRepository allergyRepository;
    private final MedicationRepository medicationRepository;
    private final ImmunizationRepository immunizationRepository;
    private final VitalReadingRepository vitalRepository;
    private final FamilyService familyService;

    public enum EntryType {
        CONDITION, ALLERGY, MEDICATION_STARTED, MEDICATION_STOPPED, IMMUNIZATION, VITAL
    }

    public record Entry(EntryType type, Long recordId, LocalDateTime occurredAt,
                        String title, String detail, String severity, boolean notable) {
    }

    /**
     * @param limit maximum entries to return; the newest are kept
     */
    @Transactional(readOnly = true)
    public List<Entry> forMember(Long memberId, Long userId, int limit) {
        familyService.requireMemberAccess(memberId, userId, false);

        List<Entry> entries = new ArrayList<>();

        for (MedicalCondition c : conditionRepository
                .findByFamilyMemberIdAndDeletedAtIsNullOrderByIdDesc(memberId)) {
            entries.add(new Entry(EntryType.CONDITION, c.getId(),
                    at(c.getOnsetDate(), c.getCreatedAt()),
                    c.getLabel(),
                    c.getStatus() == null ? null : c.getStatus().name(),
                    c.getSeverity() == null ? null : c.getSeverity().name(),
                    c.getSeverity() == ClinicalSeverity.SEVERE
                            || c.getSeverity() == ClinicalSeverity.LIFE_THREATENING));
        }

        for (Allergy a : allergyRepository
                .findByFamilyMemberIdAndDeletedAtIsNullOrderByIdDesc(memberId)) {
            entries.add(new Entry(EntryType.ALLERGY, a.getId(),
                    at(a.getOnsetDate(), a.getCreatedAt()),
                    a.getAllergen(), a.getReaction(),
                    a.getSeverity() == null ? null : a.getSeverity().name(),
                    a.isCritical()));
        }

        for (Medication m : medicationRepository
                .findByFamilyMemberIdAndDeletedAtIsNullOrderByIdDesc(memberId)) {
            if (!m.isConfirmed()) continue;
            entries.add(new Entry(EntryType.MEDICATION_STARTED, m.getId(),
                    at(m.getStartedOn(), m.getCreatedAt()),
                    m.getName(), m.getDoseLabel(), null, false));

            // Stopping is its own event: "came off it in March" is part of the
            // history, and folding it into the start entry would hide it.
            if (m.getEndedOn() != null) {
                entries.add(new Entry(EntryType.MEDICATION_STOPPED, m.getId(),
                        m.getEndedOn().atStartOfDay(),
                        m.getName(), "Stopped", null, false));
            }
        }

        for (Immunization i : immunizationRepository
                .findByFamilyMemberIdAndDeletedAtIsNullOrderByIdDesc(memberId)) {
            entries.add(new Entry(EntryType.IMMUNIZATION, i.getId(),
                    at(i.getAdministeredOn(), i.getCreatedAt()),
                    i.getVaccine(),
                    i.getDoseNumber() == null ? null : "Dose " + i.getDoseNumber(),
                    null, false));
        }

        // Only abnormal readings reach the feed. A year of normal blood
        // pressures would bury everything else; the full series lives on the
        // vitals screen, which is where someone goes to see all of them.
        for (VitalReading v : vitalRepository
                .findByFamilyMemberIdAndDeletedAtIsNullOrderByMeasuredAtDesc(memberId)) {
            if (v.getAbnormalFlag() == null || !v.getAbnormalFlag().isAbnormal()) continue;
            entries.add(new Entry(EntryType.VITAL, v.getId(), v.getMeasuredAt(),
                    v.getVitalType().name(),
                    v.getValueCanonical().stripTrailingZeros().toPlainString() + " " + v.getUnitCanonical(),
                    v.getAbnormalFlag().name(),
                    v.getAbnormalFlag().isCritical()));
        }

        return entries.stream()
                .sorted(Comparator.comparing(Entry::occurredAt).reversed())
                .limit(limit <= 0 ? 100 : limit)
                .toList();
    }

    /**
     * Prefers the clinical date over the row's creation date.
     *
     * A medication started in 2019 and typed in today belongs in 2019; ordering
     * by creation would put every imported record at the top and make the feed
     * a data-entry log rather than a health history.
     */
    private LocalDateTime at(LocalDate clinicalDate, LocalDateTime createdAt) {
        if (clinicalDate != null) return clinicalDate.atStartOfDay();
        return createdAt == null ? LocalDateTime.now() : createdAt;
    }
}
