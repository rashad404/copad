package com.drcopad.copad.controller;

import com.drcopad.copad.dto.FamilyDTO;
import com.drcopad.copad.dto.FamilyMemberDTO;
import com.drcopad.copad.entity.Family;
import com.drcopad.copad.entity.FamilyMember;
import com.drcopad.copad.entity.FamilyRole;
import com.drcopad.copad.entity.User;
import com.drcopad.copad.service.FamilyService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Families and their members.
 *
 * Authenticated only, and never public: this is patient data. Access is decided
 * in FamilyService, which every method here routes through - a controller that
 * loaded a member by id directly would let any signed-in user read anyone's
 * record by guessing numbers.
 *
 * Member names are not logged; a family member's name identifies a patient.
 */
@Slf4j
@RestController
@RequestMapping("/api/families")
@RequiredArgsConstructor
public class FamilyController {

    private final FamilyService familyService;

    /** The caller's families, creating one on first use. */
    @GetMapping
    public ResponseEntity<List<FamilyDTO>> myFamilies(@AuthenticationPrincipal User user) {
        List<Family> families = familyService.familiesFor(user.getId());
        if (families.isEmpty()) {
            families = List.of(familyService.getOrCreateFamilyFor(user.getId()));
        }

        List<FamilyDTO> result = families.stream().map(family -> {
            FamilyRole role = familyService.requireRole(family.getId(), user.getId(), false);
            List<FamilyMemberDTO> members = familyService.membersOf(family.getId(), user.getId())
                    .stream().map(FamilyMemberDTO::from).toList();
            return FamilyDTO.from(family, role, members);
        }).toList();

        return ResponseEntity.ok(result);
    }

    @GetMapping("/{familyId}/members")
    public ResponseEntity<List<FamilyMemberDTO>> members(
            @PathVariable Long familyId,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(
                familyService.membersOf(familyId, user.getId())
                        .stream().map(FamilyMemberDTO::from).toList());
    }

    @PostMapping("/{familyId}/members")
    public ResponseEntity<FamilyMemberDTO> addMember(
            @PathVariable Long familyId,
            @RequestBody FamilyMemberDTO body,
            @AuthenticationPrincipal User user) {
        log.info("Adding member to family {} (relationship: {})", familyId, body.getRelationship());
        FamilyMember saved = familyService.addMember(familyId, user.getId(), body.toEntity(),
                Boolean.TRUE.equals(body.getAttestation()));
        return ResponseEntity.status(HttpStatus.CREATED).body(FamilyMemberDTO.from(saved));
    }

    @GetMapping("/members/{memberId}")
    public ResponseEntity<FamilyMemberDTO> member(
            @PathVariable Long memberId,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(FamilyMemberDTO.from(
                familyService.requireMemberAccess(memberId, user.getId(), false)));
    }

    @PutMapping("/members/{memberId}")
    public ResponseEntity<FamilyMemberDTO> updateMember(
            @PathVariable Long memberId,
            @RequestBody FamilyMemberDTO body,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(FamilyMemberDTO.from(
                familyService.updateMember(memberId, user.getId(), body.toEntity())));
    }

    @DeleteMapping("/members/{memberId}")
    public ResponseEntity<Void> removeMember(
            @PathVariable Long memberId,
            @AuthenticationPrincipal User user) {
        familyService.removeMember(memberId, user.getId());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{familyId}/access")
    public ResponseEntity<Void> grantAccess(
            @PathVariable Long familyId,
            @RequestParam Long userId,
            @RequestParam FamilyRole role,
            @AuthenticationPrincipal User user) {
        familyService.grantAccess(familyId, user.getId(), userId, role);
        return ResponseEntity.noContent().build();
    }
}
