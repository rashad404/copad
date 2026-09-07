package com.drcopad.copad.repository;

import com.drcopad.copad.entity.VitalReading;
import com.drcopad.copad.entity.VitalType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface VitalReadingRepository extends JpaRepository<VitalReading, Long> {

    List<VitalReading> findByFamilyMemberIdAndDeletedAtIsNullOrderByMeasuredAtDesc(Long memberId);

    List<VitalReading> findByFamilyMemberIdAndVitalTypeAndDeletedAtIsNullOrderByMeasuredAtAsc(
            Long memberId, VitalType type);

    List<VitalReading> findByFamilyMemberIdAndVitalTypeAndMeasuredAtAfterAndDeletedAtIsNullOrderByMeasuredAtAsc(
            Long memberId, VitalType type, LocalDateTime after);

    Optional<VitalReading> findFirstByFamilyMemberIdAndVitalTypeAndDeletedAtIsNullOrderByMeasuredAtDesc(
            Long memberId, VitalType type);

    Optional<VitalReading> findByIdAndDeletedAtIsNull(Long id);
}
