package com.drcopad.copad.service;

import com.drcopad.copad.entity.*;
import com.drcopad.copad.repository.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Removing a person's data, for real.
 *
 * Everywhere else in this codebase deletion is soft, deliberately: a clinical
 * record that vanishes cannot be audited, and "who removed the penicillin
 * allergy" has to stay answerable. That is the right rule for a record in use.
 *
 * It is the wrong rule for a person asking to be forgotten. A flag flip while
 * the data sits there is a lie, so this hard-deletes rows and the files behind
 * them, and keeps only a DeletionRecord: a pseudonymous id, a time, and counts.
 * Enough to answer whether something was deleted and when, never enough to
 * reconstruct what it was.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class RecordDeletionService {

    private final FamilyService familyService;
    private final FamilyMemberRepository memberRepository;
    private final FamilyMembershipRepository membershipRepository;
    private final FamilyRepository familyRepository;
    private final UserRepository userRepository;

    private final MedicalConditionRepository conditions;
    private final AllergyRepository allergies;
    private final MedicationRepository medications;
    private final ImmunizationRepository immunizations;
    private final VitalReadingRepository vitals;
    private final RecordRevisionRepository revisions;
    private final LabResultRepository labResults;
    private final DocumentRepository documents;
    private final DoctorRepository doctorRepository;

    private final DocumentStorageService storage;
    private final DeletionRecordRepository deletions;
    private final PasswordEncoder passwordEncoder;
    private final ObjectMapper json = new ObjectMapper();

    /**
     * Deletes one member's record and everything under it.
     *
     * Requires write access, because it is the most destructive write there is.
     */
    @Transactional
    public Map<String, Object> deleteMember(Long memberId, Long userId) {
        FamilyMember member = familyService.requireMemberAccess(memberId, userId, true);
        Map<String, Object> counts = purgeMember(member);
        memberRepository.delete(member);

        record(DeletionRecord.SubjectType.MEMBER, memberId, userId, counts);
        log.info("Deleted member {} and {} records", memberId, counts);
        return counts;
    }

    /**
     * Deletes the account, every member in its family, and the user.
     *
     * The password is required. This is irreversible and reachable from a
     * session someone else may have picked up, so knowing the password is the
     * one thing a stolen token does not give an attacker.
     */
    @Transactional
    public Map<String, Object> deleteAccount(Long userId, String password) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Account not found"));

        if (password == null || !passwordEncoder.matches(password, user.getPassword())) {
            throw new org.springframework.security.access.AccessDeniedException(
                    "The password does not match");
        }

        Map<String, Object> total = new LinkedHashMap<>();
        List<FamilyMembership> memberships = membershipRepository.findByUserId(userId);

        for (FamilyMembership membership : memberships) {
            Family family = membership.getFamily();
            // Only families this account alone holds. A family shared with
            // another account is not this person's to erase.
            List<FamilyMembership> others = membershipRepository.findByFamilyId(family.getId())
                    .stream().filter(m -> !m.getUser().getId().equals(userId)).toList();

            if (others.isEmpty()) {
                for (FamilyMember member : memberRepository.findByFamilyId(family.getId())) {
                    merge(total, purgeMember(member));
                    memberRepository.delete(member);
                }
                membershipRepository.delete(membership);
                familyRepository.delete(family);
            } else {
                // Leave the family intact and simply step out of it.
                membershipRepository.delete(membership);
                log.info("Account {} left family {}, which other accounts still hold",
                        userId, family.getId());
            }
        }

        // A doctor listing outlives the account differently depending on whose
        // it was. One the person wrote about themselves is their data and goes
        // with them; one we created from a public source was never theirs, so it
        // returns to being unclaimed and can be claimed again.
        //
        // Without this the foreign key simply nulls the owner, leaving a listing
        // marked "claim under review" with nobody claiming it - a state that
        // cannot be resolved, because claiming requires an unclaimed listing.
        doctorRepository.findByUserIdAndDeletedAtIsNull(userId).ifPresent(doctor -> {
            if ("self-registered".equals(doctor.getSource())) {
                doctor.setDeletedAt(LocalDateTime.now());
                doctor.setActive(false);
                doctor.setAcceptsBookings(false);
                total.merge("doctorListing", 1L, (a, b) ->
                        ((Number) a).longValue() + ((Number) b).longValue());
            } else {
                doctor.setUser(null);
                doctor.setVerification(VerificationStatus.UNCLAIMED);
                doctor.setVerifiedAt(null);
                doctor.setAcceptsBookings(false);
                total.merge("doctorListingReleased", 1L, (a, b) ->
                        ((Number) a).longValue() + ((Number) b).longValue());
            }
            doctorRepository.save(doctor);
        });

        userRepository.delete(user);
        record(DeletionRecord.SubjectType.ACCOUNT, userId, null, total);
        log.info("Deleted account {} and {} records", userId, total);
        return total;
    }

    /** Removes every clinical record under a member, and the stored files. */
    private Map<String, Object> purgeMember(FamilyMember member) {
        Long id = member.getId();

        // Files first: a row deleted before its file leaves an orphan on disk
        // that nothing points at, and nothing would ever clean up.
        int files = 0;
        for (Document document : documents.findByFamilyMemberId(id)) {
            storage.delete(document.getStorageKey());
            files++;
        }

        Map<String, Object> counts = new LinkedHashMap<>();
        counts.put("documents", documents.deleteByFamilyMemberId(id));
        counts.put("documentFiles", files);
        counts.put("labResults", labResults.deleteByFamilyMemberId(id));
        counts.put("allergies", allergies.deleteByFamilyMemberId(id));
        counts.put("medications", medications.deleteByFamilyMemberId(id));
        counts.put("conditions", conditions.deleteByFamilyMemberId(id));
        counts.put("immunizations", immunizations.deleteByFamilyMemberId(id));
        counts.put("vitals", vitals.deleteByFamilyMemberId(id));
        // The audit trail goes too. Keeping a history of a record that no
        // longer exists would be keeping the thing we said we deleted.
        counts.put("changeHistory", revisions.deleteByFamilyMemberId(id));
        return counts;
    }

    private void merge(Map<String, Object> total, Map<String, Object> part) {
        part.forEach((k, v) -> total.merge(k, v,
                (a, b) -> ((Number) a).longValue() + ((Number) b).longValue()));
    }

    private void record(DeletionRecord.SubjectType type, Long ref, Long by,
                        Map<String, Object> counts) {
        DeletionRecord entry = new DeletionRecord();
        entry.setSubjectType(type);
        entry.setSubjectRef(ref);
        entry.setRequestedBy(by);
        try {
            entry.setRemovedCounts(json.writeValueAsString(counts));
        } catch (Exception e) {
            entry.setRemovedCounts(null);
        }
        deletions.save(entry);
    }
}
