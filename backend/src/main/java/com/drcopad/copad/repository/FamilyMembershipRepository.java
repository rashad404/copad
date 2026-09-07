package com.drcopad.copad.repository;

import com.drcopad.copad.entity.FamilyMembership;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FamilyMembershipRepository extends JpaRepository<FamilyMembership, Long> {

    Optional<FamilyMembership> findByFamilyIdAndUserId(Long familyId, Long userId);

    List<FamilyMembership> findByFamilyId(Long familyId);

    List<FamilyMembership> findByUserId(Long userId);
}
