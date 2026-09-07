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

    /**
     * The public directory.
     *
     * Inactive and deleted listings are excluded here rather than filtered by
     * the caller, so a page cannot forget and show one. Unverified listings are
     * included on purpose: a directory that only showed doctors who had claimed
     * their entry would be empty, and hiding the distinction is not the same as
     * being honest about it - the listing carries its own status.
     */
    @Query("SELECT DISTINCT d FROM Doctor d LEFT JOIN d.clinics c "
            + "WHERE d.deletedAt IS NULL AND d.active = true "
            + "AND d.verification <> 'REJECTED' "
            + "AND (:specialty IS NULL OR d.specialtyCode = :specialty) "
            + "AND (:city IS NULL OR LOWER(c.city) = LOWER(:city)) "
            + "AND (:language IS NULL OR LOWER(d.languages) LIKE LOWER(CONCAT('%', :language, '%'))) "
            + "AND (:q IS NULL OR LOWER(d.fullName) LIKE LOWER(CONCAT('%', :q, '%'))) "
            + "ORDER BY CASE WHEN d.verification = 'VERIFIED' THEN 0 ELSE 1 END, d.fullName ASC")
    Page<Doctor> publicSearch(@Param("specialty") String specialty,
                              @Param("city") String city,
                              @Param("language") String language,
                              @Param("q") String q,
                              Pageable pageable);

    /** Slugs for the sitemap, oldest first so paging stays stable across a crawl. */
    @Query("SELECT d FROM Doctor d WHERE d.deletedAt IS NULL AND d.active = true "
            + "AND d.verification <> 'REJECTED' ORDER BY d.id")
    Page<Doctor> publicSlugs(Pageable pageable);

    long countByDeletedAtIsNullAndActiveTrue();
}
