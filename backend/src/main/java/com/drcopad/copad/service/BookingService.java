package com.drcopad.copad.service;

import com.drcopad.copad.entity.*;
import com.drcopad.copad.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Making, changing and cancelling appointments.
 *
 * Two people reaching for the last slot is the ordinary case, not the rare one,
 * so the database holds the constraint and this catches the loss. Checking
 * first and inserting after would still lose the race; it would just lose it
 * less often, which is worse because it would look correct in testing.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class BookingService {

    /** Thrown when the slot went to somebody else. */
    public static class SlotTakenException extends RuntimeException {
        public SlotTakenException(String message) {
            super(message);
        }
    }

    private final BookingRepository bookings;
    private final DoctorRepository doctors;
    private final ClinicRepository clinics;
    private final FamilyService familyService;
    private final UserRepository users;
    private final AvailabilityService availabilityService;

    /**
     * Books an appointment.
     *
     * Requires write access to the member, because an appointment is a thing
     * done on their behalf.
     */
    @Transactional
    public Booking book(Long doctorId, Long memberId, Long userId, Long clinicId,
                        LocalDateTime startsAt, String reason, boolean shareRecord) {

        FamilyMember member = familyService.requireMemberAccess(memberId, userId, true);

        Doctor doctor = doctors.findByIdAndDeletedAtIsNull(doctorId)
                .orElseThrow(() -> new IllegalArgumentException("Doctor not found"));

        // A listing nobody is watching must not take appointments. Someone who
        // turns up to one is worse off than someone who never booked.
        if (!doctor.isBookable()) {
            throw new IllegalArgumentException(
                    "This doctor is not taking appointments through azdoc");
        }

        // Checked against what is genuinely offered, not against what was sent.
        // A client can post any time it likes.
        if (!availabilityService.isOffered(doctorId, startsAt)) {
            throw new SlotTakenException("That time is no longer available");
        }

        Booking booking = new Booking();
        booking.setDoctor(doctor);
        booking.setFamilyMember(member);
        // A real reference, not a stand-in. An anonymous subclass would not be
        // the entity JPA expects and would fail on the way to the database.
        booking.setBookedBy(userId == null ? null : users.findById(userId).orElse(null));
        booking.setStartsAt(startsAt);
        booking.setEndsAt(startsAt.plusMinutes(slotMinutesFor(doctorId, startsAt)));
        booking.setStatus(BookingStatus.REQUESTED);
        booking.setReason(reason);
        // Per booking, never a setting. Sharing with one doctor is not sharing
        // with all of them.
        booking.setSharedRecord(shareRecord);

        if (clinicId != null) {
            clinics.findByIdAndDeletedAtIsNull(clinicId).ifPresent(booking::setClinic);
        }

        try {
            Booking saved = bookings.saveAndFlush(booking);
            // No patient detail: who saw whom is itself sensitive.
            log.info("Booking {} created for doctor {}", saved.getId(), doctorId);
            return saved;
        } catch (DataIntegrityViolationException e) {
            // Somebody else took it between the check and the insert. This is
            // the case the unique constraint exists for.
            log.info("Slot taken concurrently for doctor {}", doctorId);
            throw new SlotTakenException("That time was just taken. Please choose another.");
        }
    }

    private int slotMinutesFor(Long doctorId, LocalDateTime startsAt) {
        return availabilityService.slotsFor(doctorId, startsAt.toLocalDate(), startsAt.toLocalDate())
                .stream()
                .filter(s -> s.startsAt().equals(startsAt))
                .findFirst()
                .map(s -> (int) java.time.Duration.between(s.startsAt(), s.endsAt()).toMinutes())
                .orElse(20);
    }

    /**
     * Cancels a booking, which frees the slot for somebody else.
     *
     * The row stays: a cancelled appointment is part of what happened, and the
     * doctor's side may need to know it existed.
     */
    @Transactional
    public Booking cancel(Long bookingId, Long userId, String reason) {
        Booking booking = require(bookingId, userId);

        if (!booking.getStatus().holdsSlot()) {
            throw new IllegalArgumentException("This appointment is not active");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        booking.setCancelledAt(LocalDateTime.now());
        booking.setCancellationReason(reason);
        Booking saved = bookings.save(booking);
        log.info("Booking {} cancelled", bookingId);
        return saved;
    }

    @Transactional(readOnly = true)
    public List<Booking> forMember(Long memberId, Long userId) {
        familyService.requireMemberAccess(memberId, userId, false);
        return bookings.findByFamilyMemberIdOrderByStartsAtDesc(memberId);
    }

    /** Loads a booking, confirming the caller may act on the person it is for. */
    @Transactional(readOnly = true)
    public Booking require(Long bookingId, Long userId) {
        Booking booking = bookings.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Appointment not found"));
        familyService.requireMemberAccess(
                booking.getFamilyMember().getId(), userId, true);
        return booking;
    }
}
