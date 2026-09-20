package com.drcopad.copad.repository;

import com.drcopad.copad.entity.Clinic;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ClinicRepository extends JpaRepository<Clinic, Long> {

    Page<Clinic> findByDeletedAtIsNullOrderByNameAsc(Pageable pageable);

    Optional<Clinic> findByIdAndDeletedAtIsNull(Long id);

    Optional<Clinic> findBySlugAndDeletedAtIsNull(String slug);

    boolean existsBySlug(String slug);

    /** The cities we actually have clinics in, for the search to choose from. */
    @Query("SELECT DISTINCT c.city FROM Clinic c "
            + "WHERE c.deletedAt IS NULL AND c.active = true "
            + "AND c.city IS NOT NULL AND c.city <> '' ORDER BY c.city")
    List<String> distinctCities();
}
