package com.drcopad.copad.repository;

import com.drcopad.copad.entity.Booking;
import com.drcopad.copad.entity.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    /** Bookings that still hold their slot in a window, for building a calendar. */
    List<Booking> findByDoctorIdAndStatusInAndStartsAtBetween(
            Long doctorId, List<BookingStatus> statuses, LocalDateTime from, LocalDateTime to);

    List<Booking> findByFamilyMemberIdOrderByStartsAtDesc(Long familyMemberId);

    List<Booking> findByBookedByIdOrderByStartsAtDesc(Long userId);

    /** Due a reminder: still live, starting soon, not yet reminded. */
    List<Booking> findByStatusInAndReminderSentAtIsNullAndStartsAtBetween(
            List<BookingStatus> statuses, LocalDateTime from, LocalDateTime to);
}
