package com.drcopad.copad.repository;

import com.drcopad.copad.entity.Allergy;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AllergyRepository extends JpaRepository<Allergy, Long> {

    List<Allergy> findByFamilyMemberIdAndDeletedAtIsNullOrderByIdDesc(Long familyMemberId);

    Optional<Allergy> findByIdAndDeletedAtIsNull(Long id);

    /** Real deletion, for a person who asked to be removed. */
    long deleteByFamilyMemberId(Long familyMemberId);
}
