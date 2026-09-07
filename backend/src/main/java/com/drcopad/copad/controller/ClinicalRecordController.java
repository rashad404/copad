package com.drcopad.copad.controller;

import com.drcopad.copad.dto.ClinicalRecordDTOs.*;
import com.drcopad.copad.entity.User;
import com.drcopad.copad.service.ClinicalRecordService;
import com.drcopad.copad.service.RecordDataExportService;
import com.drcopad.copad.service.RecordDeletionService;
import com.drcopad.copad.service.RecordExportService;
import com.drcopad.copad.service.TimelineService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

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
    private final TimelineService timeline;
    private final RecordExportService export;
    private final RecordDataExportService dataExport;
    private final RecordDeletionService deletion;

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

    // --- Timeline and export -----------------------------------------------

    /** Every record type interleaved by date, newest first. */
    @GetMapping("/timeline")
    public List<TimelineService.Entry> timeline(@PathVariable Long memberId,
                                                @RequestParam(defaultValue = "100") int limit,
                                                @AuthenticationPrincipal User user) {
        return timeline.forMember(memberId, user.getId(), limit);
    }

    /** One-page summary to hand a doctor. */
    /**
     * Everything held about this person, as an archive they can keep.
     *
     * The PDF above is a summary for a consultation. This is the record itself:
     * the values as data, and the documents as files, so the copy is still
     * useful once it leaves here.
     */
    /**
     * Removes this person's record permanently.
     *
     * Not the soft delete used everywhere else. Rows and files both go, and only
     * a content-free note that a deletion happened is kept. Irreversible, so the
     * interface must say so before calling it.
     */
    @DeleteMapping("/data")
    public Map<String, Object> deleteMemberData(@PathVariable Long memberId,
                                                @AuthenticationPrincipal User user) {
        return Map.of("deleted", true,
                "removed", deletion.deleteMember(memberId, user.getId()));
    }

    @GetMapping("/export.zip")
    public ResponseEntity<byte[]> export(@PathVariable Long memberId,
                                         @AuthenticationPrincipal User user) {
        byte[] archive = dataExport.export(memberId, user.getId());
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"azdoc-record.zip\"")
                // The person's whole record; never in a shared cache.
                .header(HttpHeaders.CACHE_CONTROL, "private, no-store")
                .body(archive);
    }

    @GetMapping("/summary.pdf")
    public ResponseEntity<byte[]> summaryPdf(@PathVariable Long memberId,
                                             @AuthenticationPrincipal User user) {
        byte[] pdf = export.summaryPdf(memberId, user.getId());
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                // inline so it previews in the browser; a doctor visit is more
                // likely to want it on screen than in a downloads folder.
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"health-summary.pdf\"")
                .body(pdf);
    }

    // --- Audit -------------------------------------------------------------

    /** Who changed what, and when. */
    @GetMapping("/history")
    public List<RevisionDTO> history(@PathVariable Long memberId,
                                     @AuthenticationPrincipal User user) {
        return records.history(memberId, user.getId()).stream().map(RevisionDTO::from).toList();
    }
}
