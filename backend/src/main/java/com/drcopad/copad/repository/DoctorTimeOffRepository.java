package com.drcopad.copad.repository;

import com.drcopad.copad.entity.DoctorTimeOff;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface DoctorTimeOffRepository extends JpaRepository<DoctorTimeOff, Long> {

    /** Any absence overlapping the window being offered. */
    List<DoctorTimeOff> findByDoctorIdAndEndsAtAfterAndStartsAtBefore(
            Long doctorId, LocalDateTime from, LocalDateTime to);
}
