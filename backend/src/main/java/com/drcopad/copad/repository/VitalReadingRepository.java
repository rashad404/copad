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

    /** The ids already taken from a source, so a resend can be skipped cheaply. */
    @org.springframework.data.jpa.repository.Query(
            "SELECT v.sourceRef FROM VitalReading v WHERE v.familyMember.id = :memberId "
            + "AND v.source = :source AND v.sourceRef IN :refs")
    java.util.List<String> existingRefs(
            @org.springframework.data.repository.query.Param("memberId") Long memberId,
            @org.springframework.data.repository.query.Param("source")
            com.drcopad.copad.entity.VitalSource source,
            @org.springframework.data.repository.query.Param("refs") java.util.List<String> refs);

    /**
     * Whether the person already recorded this themselves.
     *
     * A reading entered by hand is the more considered one and must not be
     * displaced by a watch sample from the same minute.
     */
    boolean existsByFamilyMemberIdAndVitalTypeAndSourceAndMeasuredAtBetweenAndDeletedAtIsNull(
            Long memberId, com.drcopad.copad.entity.VitalType type,
            com.drcopad.copad.entity.VitalSource source,
            java.time.LocalDateTime from, java.time.LocalDateTime to);

    /** Real deletion, for a person who asked to be removed. */
    long deleteByFamilyMemberId(Long familyMemberId);
}
