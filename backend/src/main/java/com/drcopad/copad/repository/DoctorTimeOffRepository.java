package com.drcopad.copad.repository;

import com.drcopad.copad.entity.DoctorTimeOff;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface DoctorTimeOffRepository extends JpaRepository<DoctorTimeOff, Long> {

    /** Any absence overlapping the window being offered. */
    /** Everything upcoming, so a doctor can see and undo what they booked off. */
    List<DoctorTimeOff> findByDoctorIdAndEndsAtAfterOrderByStartsAtAsc(
            Long doctorId, java.time.LocalDateTime after);

    List<DoctorTimeOff> findByDoctorIdAndEndsAtAfterAndStartsAtBefore(
            Long doctorId, LocalDateTime from, LocalDateTime to);
}
