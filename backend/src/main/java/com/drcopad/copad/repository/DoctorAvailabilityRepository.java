package com.drcopad.copad.repository;

import com.drcopad.copad.entity.DoctorAvailability;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DoctorAvailabilityRepository extends JpaRepository<DoctorAvailability, Long> {

    List<DoctorAvailability> findByDoctorIdAndActiveTrue(Long doctorId);

    List<DoctorAvailability> findByDoctorId(Long doctorId);
}
