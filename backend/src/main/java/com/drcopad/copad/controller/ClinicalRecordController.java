package com.drcopad.copad.controller;

import com.drcopad.copad.dto.ClinicalRecordDTOs.*;
import com.drcopad.copad.entity.User;
import com.drcopad.copad.service.ClinicalRecordService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * A family member's clinical record.
 *
 * Everything is scoped to a member id and access-checked in the service; no
 * method trusts the caller's claim to a member. Nothing here logs clinical
 * content - a condition label or an allergen is patient data.
 */
@Slf4j
@RestController
@RequestMapping("/api/members/{memberId}")
@RequiredArgsConstructor
public class ClinicalRecordController {

    private final ClinicalRecordService records;

    // --- Conditions --------------------------------------------------------

    @GetMapping("/conditions")
    public List<ConditionDTO> conditions(@PathVariable Long memberId,
                                         @AuthenticationPrincipal User user) {
        return records.conditions(memberId, user.getId()).stream().map(ConditionDTO::from).toList();
    }

    @PostMapping("/conditions")
    @ResponseStatus(HttpStatus.CREATED)
    public ConditionDTO addCondition(@PathVariable Long memberId,
                                     @RequestBody ConditionDTO body,
                                     @AuthenticationPrincipal User user) {
        return ConditionDTO.from(records.addCondition(memberId, user.getId(), body.toEntity()));
    }

    @PutMapping("/conditions/{id}")
    public ConditionDTO updateCondition(@PathVariable Long memberId, @PathVariable Long id,
                                        @RequestBody ConditionDTO body,
                                        @AuthenticationPrincipal User user) {
        return ConditionDTO.from(records.updateCondition(id, user.getId(), body.toEntity()));
    }

    @DeleteMapping("/conditions/{id}")
    public ResponseEntity<Void> deleteCondition(@PathVariable Long memberId, @PathVariable Long id,
                                                @AuthenticationPrincipal User user) {
        records.deleteCondition(id, user.getId());
        return ResponseEntity.noContent().build();
    }

    // --- Allergies ---------------------------------------------------------

    @GetMapping("/allergies")
    public List<AllergyDTO> allergies(@PathVariable Long memberId,
                                      @AuthenticationPrincipal User user) {
        return records.allergies(memberId, user.getId()).stream().map(AllergyDTO::from).toList();
    }

    @PostMapping("/allergies")
    @ResponseStatus(HttpStatus.CREATED)
    public AllergyDTO addAllergy(@PathVariable Long memberId,
                                 @RequestBody AllergyDTO body,
                                 @AuthenticationPrincipal User user) {
        return AllergyDTO.from(records.addAllergy(memberId, user.getId(), body.toEntity()));
    }

    @PutMapping("/allergies/{id}")
    public AllergyDTO updateAllergy(@PathVariable Long memberId, @PathVariable Long id,
                                    @RequestBody AllergyDTO body,
                                    @AuthenticationPrincipal User user) {
        return AllergyDTO.from(records.updateAllergy(id, user.getId(), body.toEntity()));
    }

    @DeleteMapping("/allergies/{id}")
    public ResponseEntity<Void> deleteAllergy(@PathVariable Long memberId, @PathVariable Long id,
                                              @AuthenticationPrincipal User user) {
        records.deleteAllergy(id, user.getId());
        return ResponseEntity.noContent().build();
    }

    // --- Medications -------------------------------------------------------

    @GetMapping("/medications")
    public List<MedicationDTO> medications(@PathVariable Long memberId,
                                           @AuthenticationPrincipal User user) {
        return records.medications(memberId, user.getId()).stream().map(MedicationDTO::from).toList();
    }

    @PostMapping("/medications")
    @ResponseStatus(HttpStatus.CREATED)
    public MedicationDTO addMedication(@PathVariable Long memberId,
                                       @RequestBody MedicationDTO body,
                                       @AuthenticationPrincipal User user) {
        return MedicationDTO.from(records.addMedication(memberId, user.getId(), body.toEntity()));
    }

    @PutMapping("/medications/{id}")
    public MedicationDTO updateMedication(@PathVariable Long memberId, @PathVariable Long id,
                                          @RequestBody MedicationDTO body,
                                          @AuthenticationPrincipal User user) {
        return MedicationDTO.from(records.updateMedication(id, user.getId(), body.toEntity()));
    }

    @DeleteMapping("/medications/{id}")
    public ResponseEntity<Void> deleteMedication(@PathVariable Long memberId, @PathVariable Long id,
                                                 @AuthenticationPrincipal User user) {
        records.deleteMedication(id, user.getId());
        return ResponseEntity.noContent().build();
    }

    // --- Immunizations -----------------------------------------------------

    @GetMapping("/immunizations")
    public List<ImmunizationDTO> immunizations(@PathVariable Long memberId,
                                               @AuthenticationPrincipal User user) {
        return records.immunizations(memberId, user.getId()).stream()
                .map(ImmunizationDTO::from).toList();
    }

    @PostMapping("/immunizations")
    @ResponseStatus(HttpStatus.CREATED)
    public ImmunizationDTO addImmunization(@PathVariable Long memberId,
                                           @RequestBody ImmunizationDTO body,
                                           @AuthenticationPrincipal User user) {
        return ImmunizationDTO.from(records.addImmunization(memberId, user.getId(), body.toEntity()));
    }

    @PutMapping("/immunizations/{id}")
    public ImmunizationDTO updateImmunization(@PathVariable Long memberId, @PathVariable Long id,
                                               @RequestBody ImmunizationDTO body,
                                               @AuthenticationPrincipal User user) {
        return ImmunizationDTO.from(records.updateImmunization(
                memberId, id, user.getId(), body.toEntity()));
    }

    @DeleteMapping("/immunizations/{id}")
    public ResponseEntity<Void> deleteImmunization(@PathVariable Long memberId, @PathVariable Long id,
                                                   @AuthenticationPrincipal User user) {
        records.deleteImmunization(id, user.getId());
        return ResponseEntity.noContent().build();
    }

    // --- Audit -------------------------------------------------------------

    /** Who changed what, and when. */
    @GetMapping("/history")
    public List<RevisionDTO> history(@PathVariable Long memberId,
                                     @AuthenticationPrincipal User user) {
        return records.history(memberId, user.getId()).stream().map(RevisionDTO::from).toList();
    }
}
