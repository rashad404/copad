package com.drcopad.copad.dto;

import com.drcopad.copad.entity.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Wire shapes for the clinical record.
 *
 * Entities are never serialised directly: they carry lazy associations back to
 * the family and its other members, and returning those would leak one person's
 * data into another's response.
 */
public final class ClinicalRecordDTOs {

    private ClinicalRecordDTOs() {
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ConditionDTO {
        private Long id;
        private String label;
        private String icd10Code;
        private ConditionStatus status;
        private ClinicalSeverity severity;
        private LocalDate onsetDate;
        private LocalDate resolvedDate;
        private String notes;
        private boolean current;

        public static ConditionDTO from(MedicalCondition c) {
            return ConditionDTO.builder()
                    .id(c.getId()).label(c.getLabel()).icd10Code(c.getIcd10Code())
                    .status(c.getStatus()).severity(c.getSeverity())
                    .onsetDate(c.getOnsetDate()).resolvedDate(c.getResolvedDate())
                    .notes(c.getNotes()).current(c.isCurrent())
                    .build();
        }

        public MedicalCondition toEntity() {
            MedicalCondition c = new MedicalCondition();
            c.setLabel(label);
            c.setIcd10Code(icd10Code);
            c.setStatus(status == null ? ConditionStatus.ACTIVE : status);
            c.setSeverity(severity);
            c.setOnsetDate(onsetDate);
            c.setResolvedDate(resolvedDate);
            c.setNotes(notes);
            return c;
        }
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AllergyDTO {
        private Long id;
        private String allergen;
        private AllergenType allergenType;
        private String reaction;
        private ClinicalSeverity severity;
        private LocalDate onsetDate;
        private boolean active;
        private String notes;
        /** Surfaced so clients can lead with it rather than sorting by severity themselves. */
        private boolean critical;

        public static AllergyDTO from(Allergy a) {
            return AllergyDTO.builder()
                    .id(a.getId()).allergen(a.getAllergen()).allergenType(a.getAllergenType())
                    .reaction(a.getReaction()).severity(a.getSeverity())
                    .onsetDate(a.getOnsetDate()).active(a.isActive())
                    .notes(a.getNotes()).critical(a.isCritical())
                    .build();
        }

        public Allergy toEntity() {
            Allergy a = new Allergy();
            a.setAllergen(allergen);
            a.setAllergenType(allergenType == null ? AllergenType.OTHER : allergenType);
            a.setReaction(reaction);
            a.setSeverity(severity == null ? ClinicalSeverity.UNKNOWN : severity);
            a.setOnsetDate(onsetDate);
            a.setActive(active);
            a.setNotes(notes);
            return a;
        }
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class MedicationDTO {
        private Long id;
        private String name;
        private Long medicineId;
        private String activeIngredient;
        private BigDecimal doseAmount;
        private String doseUnit;
        private String doseLabel;
        private String frequency;
        private MedicationRoute route;
        private LocalDate startedOn;
        private LocalDate endedOn;
        private boolean active;
        private String prescriber;
        private String reason;
        private String notes;

        public static MedicationDTO from(Medication m) {
            return MedicationDTO.builder()
                    .id(m.getId()).name(m.getName()).medicineId(m.getMedicineId())
                    .activeIngredient(m.getActiveIngredient())
                    .doseAmount(m.getDoseAmount()).doseUnit(m.getDoseUnit())
                    .doseLabel(m.getDoseLabel()).frequency(m.getFrequency())
                    .route(m.getRoute()).startedOn(m.getStartedOn()).endedOn(m.getEndedOn())
                    .active(m.isActive()).prescriber(m.getPrescriber())
                    .reason(m.getReason()).notes(m.getNotes())
                    .build();
        }

        public Medication toEntity() {
            Medication m = new Medication();
            m.setName(name);
            m.setMedicineId(medicineId);
            m.setActiveIngredient(activeIngredient);
            m.setDoseAmount(doseAmount);
            m.setDoseUnit(doseUnit);
            m.setFrequency(frequency);
            m.setRoute(route);
            m.setStartedOn(startedOn);
            m.setEndedOn(endedOn);
            m.setActive(active);
            m.setPrescriber(prescriber);
            m.setReason(reason);
            m.setNotes(notes);
            return m;
        }
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ImmunizationDTO {
        private Long id;
        private String vaccine;
        private Integer doseNumber;
        private LocalDate administeredOn;
        private String provider;
        private String lotNumber;
        private LocalDate nextDueOn;
        private boolean overdue;
        private String notes;

        public static ImmunizationDTO from(Immunization i) {
            return ImmunizationDTO.builder()
                    .id(i.getId()).vaccine(i.getVaccine()).doseNumber(i.getDoseNumber())
                    .administeredOn(i.getAdministeredOn()).provider(i.getProvider())
                    .lotNumber(i.getLotNumber()).nextDueOn(i.getNextDueOn())
                    .overdue(i.isOverdue()).notes(i.getNotes())
                    .build();
        }

        public Immunization toEntity() {
            Immunization i = new Immunization();
            i.setVaccine(vaccine);
            i.setDoseNumber(doseNumber);
            i.setAdministeredOn(administeredOn);
            i.setProvider(provider);
            i.setLotNumber(lotNumber);
            i.setNextDueOn(nextDueOn);
            i.setNotes(notes);
            return i;
        }
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RevisionDTO {
        private Long id;
        private String recordType;
        private Long recordId;
        private RecordAction action;
        private String changedByName;
        private String snapshot;
        private LocalDateTime createdAt;

        public static RevisionDTO from(RecordRevision r) {
            return RevisionDTO.builder()
                    .id(r.getId()).recordType(r.getRecordType()).recordId(r.getRecordId())
                    .action(r.getAction())
                    .changedByName(r.getChangedBy() == null ? null : r.getChangedBy().getName())
                    .snapshot(r.getSnapshot()).createdAt(r.getCreatedAt())
                    .build();
        }
    }
}
