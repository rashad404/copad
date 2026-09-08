package com.drcopad.copad.repository;

import com.drcopad.copad.entity.LabOrder;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LabOrderRepository extends JpaRepository<LabOrder, Long> {

    List<LabOrder> findByFamilyMemberIdOrderByCreatedAtDesc(Long familyMemberId);

    Optional<LabOrder> findByIdAndFamilyMemberId(Long id, Long familyMemberId);
}
