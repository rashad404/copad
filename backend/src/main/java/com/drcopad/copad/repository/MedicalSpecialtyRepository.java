package com.drcopad.copad.repository;

import com.drcopad.copad.entity.MedicalSpecialty;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface MedicalSpecialtyRepository extends JpaRepository<MedicalSpecialty, Long> {
    Optional<MedicalSpecialty> findByName(String name);
    Optional<MedicalSpecialty> findByCode(String code);
    List<MedicalSpecialty> findByIsActiveTrue();
} 