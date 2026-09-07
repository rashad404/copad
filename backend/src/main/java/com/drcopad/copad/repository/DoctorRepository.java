package com.drcopad.copad.repository;

import com.drcopad.copad.entity.Doctor;
import com.drcopad.copad.entity.VerificationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {

    Optional<Doctor> findByIdAndDeletedAtIsNull(Long id);

    Optional<Doctor> findBySlugAndDeletedAtIsNull(String slug);

    Optional<Doctor> findByUserIdAndDeletedAtIsNull(Long userId);

    boolean existsBySlug(String slug);

    /**
     * The admin listing, filtered by whatever was supplied.
     *
     * Includes every verification state, because curating the unverified ones is
     * the point of the screen.
     */
    @Query("SELECT d FROM Doctor d WHERE d.deletedAt IS NULL "
            + "AND (:specialty IS NULL OR d.specialtyCode = :specialty) "
            + "AND (:verification IS NULL OR d.verification = :verification) "
            + "ORDER BY d.fullName ASC")
    Page<Doctor> search(@Param("specialty") String specialty,
                        @Param("verification") VerificationStatus verification,
                        Pageable pageable);
}
