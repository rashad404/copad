package com.drcopad.copad.repository;

import com.drcopad.copad.entity.LabResult;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LabResultRepository extends JpaRepository<LabResult, Long> {

    List<LabResult> findByFamilyMemberIdAndDeletedAtIsNullOrderByCollectedAtDesc(Long memberId);

    /** One analyte over time, which is what a trend chart draws. */
    List<LabResult> findByFamilyMemberIdAndAnalyteKeyAndDeletedAtIsNullOrderByCollectedAtAsc(
            Long memberId, String analyteKey);

    List<LabResult> findByDocumentIdAndDeletedAtIsNullOrderByIdAsc(Long documentId);

    List<LabResult> findByFamilyMemberIdAndConfirmedFalseAndDeletedAtIsNull(Long memberId);

    Optional<LabResult> findByIdAndDeletedAtIsNull(Long id);
}
