package com.drcopad.copad.service;

import com.drcopad.copad.entity.*;
import com.drcopad.copad.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Families, their members, and who may read or change them.
 *
 * Every access check lives here rather than in controllers. A record belongs to
 * a family member, and the question "may this user see it?" has exactly one
 * answer, so it should have exactly one implementation.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class FamilyService {

    /**
     * Whether an attestation is demanded rather than merely recorded.
     *
     * Off until the interface sends one, so turning this on is a deliberate act
     * rather than an outage.
     */
    @org.springframework.beans.factory.annotation.Value("${consent.require-attestation:false}")
    private boolean requireAttestation;


    private final FamilyRepository familyRepository;
    private final FamilyMemberRepository memberRepository;
    private final FamilyMembershipRepository membershipRepository;
    private final UserRepository userRepository;
    private final ConsentService consents;

    /**
     * The user's family, created on first use.
     *
     * Registration predates this model and existing accounts were backfilled by
     * V8, but anything that creates a user outside that path would otherwise
     * leave a login with nowhere to store a record.
     */
    @Transactional
    public Family getOrCreateFamilyFor(Long userId) {
        return familyRepository.findFirstByOwnerIdAndDeletedAtIsNullOrderByCreatedAtAsc(userId)
                .orElseGet(() -> createFamilyFor(userId));
    }

    @Transactional
    public Family createFamilyFor(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));

        String displayName = (user.getName() == null || user.getName().isBlank())
                ? "My" : user.getName().trim();

        Family family = familyRepository.save(Family.builder()
                .name(displayName + " family")
                .owner(user)
                .build());

        memberRepository.save(FamilyMember.builder()
                .family(family)
                .user(user)
                .fullName(displayName.equals("My") ? user.getEmail() : displayName)
                .relationship(Relationship.SELF)
                .build());

        membershipRepository.save(FamilyMembership.builder()
                .family(family)
                .user(user)
                .role(FamilyRole.OWNER)
                .build());

        log.info("Created family {} for user {}", family.getId(), userId);
        return family;
    }

    @Transactional(readOnly = true)
    public List<Family> familiesFor(Long userId) {
        return familyRepository.findAllForUser(userId);
    }

    @Transactional(readOnly = true)
    public List<FamilyMember> membersOf(Long familyId, Long requestingUserId) {
        requireRole(familyId, requestingUserId, false);
        return memberRepository.findByFamilyIdAndDeletedAtIsNullOrderByIdAsc(familyId);
    }

    /**
     * Loads a member, confirming the caller may reach it.
     *
     * Callers must use this rather than the repository: fetching by id alone
     * would let any authenticated user read any member by guessing a number.
     */
    @Transactional(readOnly = true)
    public FamilyMember requireMemberAccess(Long memberId, Long requestingUserId, boolean forWrite) {
        FamilyMember member = memberRepository.findByIdAndDeletedAtIsNull(memberId)
                .orElseThrow(() -> new IllegalArgumentException("Member not found: " + memberId));
        requireRole(member.getFamily().getId(), requestingUserId, forWrite);
        return member;
    }

    /** Kept for callers that add a member for the account holder themselves. */
    @Transactional
    public FamilyMember addMember(Long familyId, Long requestingUserId, FamilyMember details) {
        return addMember(familyId, requestingUserId, details, false);
    }

    /**
     * Adds a person to a family.
     *
     * @param attested the account holder's claim to be entitled to hold this
     *                 person's record. A child cannot consent, so the basis is a
     *                 guardian's; a competent adult consents for themselves and
     *                 the account holder is stating they have that permission.
     *                 Which of the two applies follows from the person's age.
     *
     * Recorded rather than required, for now. Requiring it today would break
     * every existing client mid-flight; the requirement switches on with
     * consent.require-attestation once the interface sends it. An unattested
     * addition is logged so the gap stays visible rather than silent.
     */
    @Transactional
    public FamilyMember addMember(Long familyId, Long requestingUserId,
                                  FamilyMember details, boolean attested) {
        requireRole(familyId, requestingUserId, true);

        Family family = familyRepository.findByIdAndDeletedAtIsNull(familyId)
                .orElseThrow(() -> new IllegalArgumentException("Family not found: " + familyId));

        if (details.getRelationship() == Relationship.SELF
                && memberRepository.findFirstByFamilyIdAndRelationshipAndDeletedAtIsNull(
                        familyId, Relationship.SELF).isPresent()) {
            throw new IllegalArgumentException("This family already has a SELF member");
        }

        details.setFamily(family);
        details.setId(null);
        FamilyMember saved = memberRepository.save(details);

        // Adding yourself needs no claim about anybody else.
        boolean aboutSomeoneElse = details.getRelationship() != Relationship.SELF;
        if (aboutSomeoneElse) {
            if (attested) {
                consents.grant(requestingUserId, ConsentType.GUARDIAN, saved.getId());
            } else if (requireAttestation) {
                throw new IllegalArgumentException(
                        "Adding another person's record needs a statement that you are "
                                + "entitled to hold it");
            } else {
                log.warn("Member {} added for someone else with no attestation", saved.getId());
            }
        }
        return saved;
    }

    @Transactional
    public FamilyMember updateMember(Long memberId, Long requestingUserId, FamilyMember changes) {
        FamilyMember member = requireMemberAccess(memberId, requestingUserId, true);

        member.setFullName(changes.getFullName());
        member.setRelationship(changes.getRelationship());
        member.setDateOfBirth(changes.getDateOfBirth());
        member.setBiologicalSex(changes.getBiologicalSex());
        member.setBloodType(changes.getBloodType());
        member.setAvatarUrl(changes.getAvatarUrl());
        member.setBirthWeightGrams(changes.getBirthWeightGrams());
        member.setBirthLengthCm(changes.getBirthLengthCm());
        member.setGestationalAgeWeeks(changes.getGestationalAgeWeeks());
        return memberRepository.save(member);
    }

    /**
     * Soft-deletes a member. The clinical history stays: a record that can be
     * destroyed by removing a person from a household is not a medical record.
     */
    @Transactional
    public void removeMember(Long memberId, Long requestingUserId) {
        FamilyMember member = requireMemberAccess(memberId, requestingUserId, true);

        if (member.getRelationship() == Relationship.SELF) {
            throw new IllegalArgumentException("The SELF member cannot be removed");
        }
        member.setDeletedAt(LocalDateTime.now());
        memberRepository.save(member);
    }

    @Transactional
    public FamilyMembership grantAccess(Long familyId, Long requestingUserId,
                                        Long targetUserId, FamilyRole role) {
        FamilyRole callerRole = requireRole(familyId, requestingUserId, true);
        if (!callerRole.canManageMembership()) {
            throw new AccessDeniedException("Only the family owner can change who has access");
        }

        Family family = familyRepository.findByIdAndDeletedAtIsNull(familyId)
                .orElseThrow(() -> new IllegalArgumentException("Family not found: " + familyId));
        User target = userRepository.findById(targetUserId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + targetUserId));

        FamilyMembership membership = membershipRepository
                .findByFamilyIdAndUserId(familyId, targetUserId)
                .orElseGet(() -> FamilyMembership.builder()
                        .family(family).user(target).build());
        membership.setRole(role);
        return membershipRepository.save(membership);
    }

    /**
     * Confirms the user belongs to the family and may act at the level required.
     *
     * @return the caller's role, so callers needing finer checks can branch
     */
    public FamilyRole requireRole(Long familyId, Long userId, boolean forWrite) {
        FamilyMembership membership = membershipRepository
                .findByFamilyIdAndUserId(familyId, userId)
                // Deliberately the same failure as "no such family": whether a
                // family exists is not something a stranger should be able to
                // probe by comparing error messages.
                .orElseThrow(() -> new AccessDeniedException("No access to this family"));

        if (forWrite && !membership.getRole().canWrite()) {
            throw new AccessDeniedException("Read-only access to this family");
        }
        return membership.getRole();
    }
}
