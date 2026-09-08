package com.drcopad.copad.repository;

import com.drcopad.copad.entity.Lab;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface LabRepository extends JpaRepository<Lab, Long> {

    Optional<Lab> findBySlugAndDeletedAtIsNullAndActiveTrue(String slug);

    Optional<Lab> findByIdAndDeletedAtIsNull(Long id);

    boolean existsBySlug(String slug);

    /** The public directory. Inactive and deleted are excluded here, not by callers. */
    @Query("SELECT l FROM Lab l WHERE l.deletedAt IS NULL AND l.active = true "
            + "AND (:city IS NULL OR LOWER(l.city) = LOWER(:city)) "
            + "AND (:homeOnly = false OR l.homeCollection = true) "
            + "AND (:q IS NULL OR LOWER(l.name) LIKE LOWER(CONCAT('%', :q, '%'))) "
            + "ORDER BY l.name ASC")
    Page<Lab> search(@Param("city") String city,
                     @Param("homeOnly") boolean homeOnly,
                     @Param("q") String q,
                     Pageable pageable);
}
