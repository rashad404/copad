package com.drcopad.copad.service;

import com.drcopad.copad.entity.*;
import com.drcopad.copad.repository.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * Conditions, allergies, medications and immunizations for one person.
 *
 * Two rules apply to everything here:
 *
 *  - Access is checked through FamilyService on every call. Nothing loads a
 *    record by id without first confirming the caller can reach its member.
 *  - Every change is audited. "Who removed the penicillin allergy, and when"
 *    must be answerable, so deletes are soft and a revision row is appended.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ClinicalRecordService {

    private final MedicalConditionRepository conditionRepository;
    private final AllergyRepository allergyRepository;
    private final MedicationRepository medicationRepository;
    private final ImmunizationRepository immunizationRepository;
    private final RecordRevisionRepository revisionRepository;
    private final FamilyService familyService;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;

    // --- Conditions --------------------------------------------------------

    @Transactional(readOnly = true)
    public List<MedicalCondition> conditions(Long memberId, Long userId) {
        familyService.requireMemberAccess(memberId, userId, false);
        return conditionRepository.findByFamilyMemberIdAndDeletedAtIsNullOrderByIdDesc(memberId);
    }

    @Transactional
    public MedicalCondition addCondition(Long memberId, Long userId, MedicalCondition condition) {
        FamilyMember member = familyService.requireMemberAccess(memberId, userId, true);
        condition.setId(null);
        condition.setFamilyMember(member);
        MedicalCondition saved = conditionRepository.save(condition);
        audit(member, "CONDITION", saved.getId(), RecordAction.CREATED, userId, saved);
        return saved;
    }

    @Transactional
    public MedicalCondition updateCondition(Long id, Long userId, MedicalCondition changes) {
        MedicalCondition existing = conditionRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new IllegalArgumentException("Condition not found"));
        FamilyMember member = familyService.requireMemberAccess(
                existing.getFamilyMember().getId(), userId, true);

        existing.setLabel(changes.getLabel());
        existing.setIcd10Code(changes.getIcd10Code());
        existing.setStatus(changes.getStatus());
        existing.setSeverity(changes.getSeverity());
        existing.setOnsetDate(changes.getOnsetDate());
        existing.setResolvedDate(changes.getResolvedDate());
        existing.setNotes(changes.getNotes());

        MedicalCondition saved = conditionRepository.save(existing);
        audit(member, "CONDITION", saved.getId(), RecordAction.UPDATED, userId, saved);
        return saved;
    }

    @Transactional
    public void deleteCondition(Long id, Long userId) {
        MedicalCondition existing = conditionRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new IllegalArgumentException("Condition not found"));
        FamilyMember member = familyService.requireMemberAccess(
                existing.getFamilyMember().getId(), userId, true);
        existing.setDeletedAt(LocalDateTime.now());
        conditionRepository.save(existing);
        audit(member, "CONDITION", id, RecordAction.DELETED, userId, existing);
    }

    // --- Allergies ---------------------------------------------------------

    @Transactional(readOnly = true)
    public List<Allergy> allergies(Long memberId, Long userId) {
        familyService.requireMemberAccess(memberId, userId, false);
        return allergyRepository.findByFamilyMemberIdAndDeletedAtIsNullOrderByIdDesc(memberId);
    }

    @Transactional
    public Allergy addAllergy(Long memberId, Long userId, Allergy allergy) {
        FamilyMember member = familyService.requireMemberAccess(memberId, userId, true);
        allergy.setId(null);
        allergy.setFamilyMember(member);
        Allergy saved = allergyRepository.save(allergy);
        audit(member, "ALLERGY", saved.getId(), RecordAction.CREATED, userId, saved);
        return saved;
    }

    @Transactional
    public Allergy updateAllergy(Long id, Long userId, Allergy changes) {
        Allergy existing = allergyRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new IllegalArgumentException("Allergy not found"));
        FamilyMember member = familyService.requireMemberAccess(
                existing.getFamilyMember().getId(), userId, true);

        existing.setAllergen(changes.getAllergen());
        existing.setAllergenType(changes.getAllergenType());
        existing.setReaction(changes.getReaction());
        existing.setSeverity(changes.getSeverity());
        existing.setOnsetDate(changes.getOnsetDate());
        existing.setActive(changes.isActive());
        existing.setNotes(changes.getNotes());

        Allergy saved = allergyRepository.save(existing);
        audit(member, "ALLERGY", saved.getId(), RecordAction.UPDATED, userId, saved);
        return saved;
    }

    @Transactional
    public void deleteAllergy(Long id, Long userId) {
        Allergy existing = allergyRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new IllegalArgumentException("Allergy not found"));
        FamilyMember member = familyService.requireMemberAccess(
                existing.getFamilyMember().getId(), userId, true);
        // Removing an allergy can change what the assistant considers safe, so
        // the audit row matters more here than almost anywhere else.
        existing.setDeletedAt(LocalDateTime.now());
        allergyRepository.save(existing);
        audit(member, "ALLERGY", id, RecordAction.DELETED, userId, existing);
    }

    // --- Medications -------------------------------------------------------

    @Transactional(readOnly = true)
    public List<Medication> medications(Long memberId, Long userId) {
        familyService.requireMemberAccess(memberId, userId, false);
        return medicationRepository.findByFamilyMemberIdAndDeletedAtIsNullOrderByIdDesc(memberId);
    }

    @Transactional
    public Medication addMedication(Long memberId, Long userId, Medication medication) {
        FamilyMember member = familyService.requireMemberAccess(memberId, userId, true);
        medication.setId(null);
        medication.setFamilyMember(member);
        Medication saved = medicationRepository.save(medication);
        audit(member, "MEDICATION", saved.getId(), RecordAction.CREATED, userId, saved);
        return saved;
    }

    @Transactional
    public Medication updateMedication(Long id, Long userId, Medication changes) {
        Medication existing = medicationRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new IllegalArgumentException("Medication not found"));
        FamilyMember member = familyService.requireMemberAccess(
                existing.getFamilyMember().getId(), userId, true);

        existing.setName(changes.getName());
        existing.setMedicineId(changes.getMedicineId());
        existing.setActiveIngredient(changes.getActiveIngredient());
        existing.setDoseAmount(changes.getDoseAmount());
        existing.setDoseUnit(changes.getDoseUnit());
        existing.setFrequency(changes.getFrequency());
        existing.setRoute(changes.getRoute());
        existing.setStartedOn(changes.getStartedOn());
        existing.setEndedOn(changes.getEndedOn());
        existing.setActive(changes.isActive());
        existing.setPrescriber(changes.getPrescriber());
        existing.setReason(changes.getReason());
        existing.setNotes(changes.getNotes());

        Medication saved = medicationRepository.save(existing);
        audit(member, "MEDICATION", saved.getId(), RecordAction.UPDATED, userId, saved);
        return saved;
    }

    @Transactional
    public void deleteMedication(Long id, Long userId) {
        Medication existing = medicationRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new IllegalArgumentException("Medication not found"));
        FamilyMember member = familyService.requireMemberAccess(
                existing.getFamilyMember().getId(), userId, true);
        existing.setDeletedAt(LocalDateTime.now());
        medicationRepository.save(existing);
        audit(member, "MEDICATION", id, RecordAction.DELETED, userId, existing);
    }

    // --- Immunizations -----------------------------------------------------

    @Transactional(readOnly = true)
    public List<Immunization> immunizations(Long memberId, Long userId) {
        familyService.requireMemberAccess(memberId, userId, false);
        return immunizationRepository.findByFamilyMemberIdAndDeletedAtIsNullOrderByIdDesc(memberId);
    }

    @Transactional
    public Immunization addImmunization(Long memberId, Long userId, Immunization immunization) {
        FamilyMember member = familyService.requireMemberAccess(memberId, userId, true);
        immunization.setId(null);
        immunization.setFamilyMember(member);
        Immunization saved = immunizationRepository.save(immunization);
        audit(member, "IMMUNIZATION", saved.getId(), RecordAction.CREATED, userId, saved);
        return saved;
    }

    @Transactional
    public void deleteImmunization(Long id, Long userId) {
        Immunization existing = immunizationRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new IllegalArgumentException("Immunization not found"));
        FamilyMember member = familyService.requireMemberAccess(
                existing.getFamilyMember().getId(), userId, true);
        existing.setDeletedAt(LocalDateTime.now());
        immunizationRepository.save(existing);
        audit(member, "IMMUNIZATION", id, RecordAction.DELETED, userId, existing);
    }

    // --- Audit -------------------------------------------------------------

    @Transactional(readOnly = true)
    public List<RecordRevision> history(Long memberId, Long userId) {
        familyService.requireMemberAccess(memberId, userId, false);
        return revisionRepository.findByFamilyMemberIdOrderByCreatedAtDesc(memberId);
    }

    private void audit(FamilyMember member, String type, Long recordId,
                       RecordAction action, Long userId, Object snapshot) {
        String json = null;
        try {
            json = objectMapper.writeValueAsString(summarise(snapshot));
        } catch (Exception e) {
            // An unserialisable snapshot must not prevent the change or lose the
            // audit row; the who/what/when is the part that matters.
            log.warn("Could not serialise {} snapshot for audit: {}", type, e.getMessage());
        }

        revisionRepository.save(RecordRevision.builder()
                .familyMember(member)
                .recordType(type)
                .recordId(recordId)
                .action(action)
                // Whoever made the change, which is often not the member: a
                // parent editing a child's record must be the name recorded.
                .changedBy(userId == null ? null : userRepository.findById(userId).orElse(null))
                .snapshot(json)
                .build());
    }

    /**
     * Flattens an entity to plain values for the snapshot.
     *
     * Serialising the entity directly would drag lazy associations - and with
     * them another person's data - into the audit row.
     */
    private Map<String, Object> summarise(Object record) {
        if (record instanceof MedicalCondition c) {
            return Map.of("label", String.valueOf(c.getLabel()),
                    "status", String.valueOf(c.getStatus()),
                    "severity", String.valueOf(c.getSeverity()));
        }
        if (record instanceof Allergy a) {
            return Map.of("allergen", String.valueOf(a.getAllergen()),
                    "type", String.valueOf(a.getAllergenType()),
                    "severity", String.valueOf(a.getSeverity()),
                    "active", a.isActive());
        }
        if (record instanceof Medication m) {
            return Map.of("name", String.valueOf(m.getName()),
                    "dose", String.valueOf(m.getDoseLabel()),
                    "frequency", String.valueOf(m.getFrequency()),
                    "active", m.isActive());
        }
        if (record instanceof Immunization i) {
            return Map.of("vaccine", String.valueOf(i.getVaccine()),
                    "doseNumber", String.valueOf(i.getDoseNumber()),
                    "administeredOn", String.valueOf(i.getAdministeredOn()));
        }
        return Map.of();
    }
}
