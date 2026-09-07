package com.drcopad.copad.repository;

import com.drcopad.copad.entity.FamilyMember;
import com.drcopad.copad.entity.Relationship;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FamilyMemberRepository extends JpaRepository<FamilyMember, Long> {

    List<FamilyMember> findByFamilyIdAndDeletedAtIsNullOrderByIdAsc(Long familyId);

    Optional<FamilyMember> findByIdAndDeletedAtIsNull(Long id);

    Optional<FamilyMember> findFirstByFamilyIdAndRelationshipAndDeletedAtIsNull(
            Long familyId, Relationship relationship);

    Optional<FamilyMember> findFirstByUserIdAndDeletedAtIsNull(Long userId);

    /**
     * Every member, including ones already soft-deleted.
     *
     * Deletion has to reach those too: a soft-deleted member still holds
     * their clinical rows, and leaving them behind would mean the data
     * somebody already tried to remove is the data that survives.
     */
    java.util.List<FamilyMember> findByFamilyId(Long familyId);
}
