package com.drcopad.copad.repository;

import com.drcopad.copad.entity.Medication;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MedicationRepository extends JpaRepository<Medication, Long> {

    List<Medication> findByFamilyMemberIdAndDeletedAtIsNullOrderByIdDesc(Long familyMemberId);

    Optional<Medication> findByIdAndDeletedAtIsNull(Long id);
}
