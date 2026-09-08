package com.drcopad.copad.repository;

import com.drcopad.copad.entity.LabTest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface LabTestRepository extends JpaRepository<LabTest, Long> {

    List<LabTest> findByLabIdAndActiveTrueOrderByNameAzAsc(Long labId);

    long countByLabIdAndActiveTrue(Long labId);

    /** Searched across all three names, because people type whichever they know. */
    @Query("SELECT t FROM LabTest t WHERE t.lab.id = :labId AND t.active = true "
            + "AND (:q IS NULL OR LOWER(t.nameAz) LIKE LOWER(CONCAT('%', :q, '%')) "
            + "OR LOWER(t.nameEn) LIKE LOWER(CONCAT('%', :q, '%')) "
            + "OR LOWER(t.nameRu) LIKE LOWER(CONCAT('%', :q, '%')) "
            + "OR LOWER(t.code) LIKE LOWER(CONCAT('%', :q, '%'))) "
            + "ORDER BY t.nameAz ASC")
    List<LabTest> search(@Param("labId") Long labId, @Param("q") String q);

    List<LabTest> findByIdInAndActiveTrue(List<Long> ids);
}
