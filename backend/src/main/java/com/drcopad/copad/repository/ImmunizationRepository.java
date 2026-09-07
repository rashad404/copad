package com.drcopad.copad.repository;

import com.drcopad.copad.entity.Immunization;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ImmunizationRepository extends JpaRepository<Immunization, Long> {

    List<Immunization> findByFamilyMemberIdAndDeletedAtIsNullOrderByIdDesc(Long familyMemberId);

    Optional<Immunization> findByIdAndDeletedAtIsNull(Long id);

    /** Real deletion, for a person who asked to be removed. */
    long deleteByFamilyMemberId(Long familyMemberId);
}
