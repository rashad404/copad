package com.drcopad.copad.repository;

import com.drcopad.copad.entity.Specialty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface SpecialtyRepository extends JpaRepository<Specialty, Long> {

    Optional<Specialty> findByCode(String code);

    List<Specialty> findByActiveTrueOrderBySortOrderAscNameEnAsc();

    /**
     * The directory codes that roll up to one assistant specialty.
     *
     * Only the patient-facing ones: this feeds referrals, and the codes left
     * out are the ones nobody is ever sent to see.
     */
    @Query("SELECT s.code FROM Specialty s "
            + "WHERE s.active = true AND s.patientFacing = true "
            + "AND s.aiSpecialtyCode = :aiCode")
    List<String> patientFacingCodesFor(@Param("aiCode") String aiCode);
}
