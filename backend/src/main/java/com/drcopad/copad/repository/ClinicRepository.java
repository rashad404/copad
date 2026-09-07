package com.drcopad.copad.repository;

import com.drcopad.copad.entity.Clinic;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ClinicRepository extends JpaRepository<Clinic, Long> {

    Page<Clinic> findByDeletedAtIsNullOrderByNameAsc(Pageable pageable);

    Optional<Clinic> findByIdAndDeletedAtIsNull(Long id);

    Optional<Clinic> findBySlugAndDeletedAtIsNull(String slug);

    boolean existsBySlug(String slug);
}
