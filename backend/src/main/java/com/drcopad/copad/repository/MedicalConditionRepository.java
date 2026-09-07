package com.drcopad.copad.repository;

import com.drcopad.copad.entity.MedicalCondition;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MedicalConditionRepository extends JpaRepository<MedicalCondition, Long> {

    List<MedicalCondition> findByFamilyMemberIdAndDeletedAtIsNullOrderByIdDesc(Long familyMemberId);

    Optional<MedicalCondition> findByIdAndDeletedAtIsNull(Long id);
}
