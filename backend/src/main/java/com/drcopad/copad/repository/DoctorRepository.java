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
    @Query("SELECT d FROM Doctor d LEFT JOIN d.user u WHERE d.deletedAt IS NULL "
            + "AND (:specialty IS NULL OR d.specialtyCode = :specialty) "
            + "AND (:verification IS NULL OR d.verification = :verification) "
            + "AND (:claimed IS NULL OR (:claimed = true AND d.user IS NOT NULL) "
            + "     OR (:claimed = false AND d.user IS NULL)) "
            + "AND (:q IS NULL OR LOWER(d.fullName) LIKE LOWER(CONCAT('%', :q, '%')) "
            + "     OR LOWER(d.slug) LIKE LOWER(CONCAT('%', :q, '%')) "
            + "     OR LOWER(u.email) LIKE LOWER(CONCAT('%', :q, '%'))) "
            + "ORDER BY d.fullName ASC")
    Page<Doctor> search(@Param("specialty") String specialty,
                        @Param("verification") VerificationStatus verification,
                        @Param("claimed") Boolean claimed,
                        @Param("q") String q,
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
            + "WHERE d.deletedAt IS NULL AND d.active = true AND d.unlisted = false "
            + "AND d.verification <> 'REJECTED' "
            + "AND (:specialty IS NULL OR d.specialtyCode = :specialty) "
            + "AND (:city IS NULL OR LOWER(c.city) = LOWER(:city)) "
            // Which hospital somebody works at is the question a person asks
            // when they have been told where to go rather than who to see.
            + "AND (:clinic IS NULL OR LOWER(c.slug) = LOWER(:clinic)) "
            // An unrecorded language means Azerbaijani, not "speaks nothing", so
            // a doctor with a blank field still answers the az filter.
            + "AND (:language IS NULL OR LOWER(COALESCE(NULLIF(d.languages, ''), 'az')) "
            + "LIKE LOWER(CONCAT('%', :language, '%'))) "
            + "AND (:q IS NULL OR LOWER(d.fullName) LIKE LOWER(CONCAT('%', :q, '%'))) "
            + "ORDER BY CASE WHEN d.verification = 'VERIFIED' THEN 0 ELSE 1 END, d.fullName ASC")
    Page<Doctor> publicSearch(@Param("specialty") String specialty,
                              @Param("city") String city,
                              @Param("clinic") String clinic,
                              @Param("language") String language,
                              @Param("q") String q,
                              Pageable pageable);

    /**
     * The clinics worth offering as a filter, with how many doctors each has.
     *
     * Counted through the same visibility rules as publicSearch rather than
     * off the clinic table, so the list can never offer a hospital that turns
     * out to have nobody findable in it. A clinic with no public listings -
     * the internal test clinic, one whose doctors are all unlisted - simply
     * does not appear.
     */
    @Query("SELECT c.slug, c.name, c.city, COUNT(DISTINCT d.id) FROM Doctor d JOIN d.clinics c "
            + "WHERE d.deletedAt IS NULL AND d.active = true AND d.unlisted = false "
            + "AND d.verification <> 'REJECTED' AND c.active = true AND c.deletedAt IS NULL "
            + "GROUP BY c.slug, c.name, c.city "
            + "ORDER BY COUNT(DISTINCT d.id) DESC, c.name ASC")
    java.util.List<Object[]> publicClinics();

    /**
     * How many listings the directory can actually offer for a set of specialty codes.
     *
     * Mirrors publicSearch's visibility rules rather than counting the table,
     * so the assistant is never told about a doctor a person could not find.
     */
    @Query("SELECT COUNT(d) FROM Doctor d "
            + "WHERE d.deletedAt IS NULL AND d.active = true AND d.unlisted = false "
            + "AND d.verification <> 'REJECTED' "
            + "AND d.specialtyCode IN :codes")
    long countPublicBySpecialtyCodes(@Param("codes") java.util.List<String> codes);

    /** Slugs for the sitemap, oldest first so paging stays stable across a crawl. */
    @Query("SELECT d FROM Doctor d WHERE d.deletedAt IS NULL AND d.active = true "
            + "AND d.unlisted = false AND d.verification <> 'REJECTED' ORDER BY d.id")
    Page<Doctor> publicSlugs(Pageable pageable);

    long countByDeletedAtIsNullAndActiveTrue();
}
