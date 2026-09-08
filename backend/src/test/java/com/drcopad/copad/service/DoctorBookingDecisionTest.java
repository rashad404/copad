package com.drcopad.copad.service;

import com.drcopad.copad.entity.*;
import com.drcopad.copad.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.access.AccessDeniedException;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Answering a request for an appointment.
 *
 * Bookings arrive as REQUESTED, and until a doctor can move them a person can
 * ask for a time and never be told whether they have it. The cases that matter
 * are the ones where the answer must be refused: somebody else's appointment,
 * and one that has already been settled.
 */
class DoctorBookingDecisionTest {

    private DoctorRepository doctors;
    private BookingRepository bookings;
    private DoctorSelfService service;

    private Doctor doctor;
    private Booking booking;

    @BeforeEach
    void setUp() {
        doctors = mock(DoctorRepository.class);
        bookings = mock(BookingRepository.class);
        service = new DoctorSelfService(
                doctors,
                mock(DoctorAvailabilityRepository.class),
                mock(ClinicRepository.class),
                bookings,
                mock(UserRepository.class));

        doctor = new Doctor();
        doctor.setId(7L);
        doctor.setFullName("Dr Test");

        booking = new Booking();
        booking.setId(99L);
        booking.setDoctor(doctor);
        booking.setStatus(BookingStatus.REQUESTED);
        booking.setStartsAt(LocalDateTime.now().plusDays(1));

        when(doctors.findByUserIdAndDeletedAtIsNull(1L)).thenReturn(Optional.of(doctor));
        when(bookings.findById(99L)).thenReturn(Optional.of(booking));
        when(bookings.save(any(Booking.class))).thenAnswer(i -> i.getArgument(0));
    }

    @Test
    void confirmingSetsConfirmed() {
        Booking saved = service.decide(1L, 99L, true, null);
        assertEquals(BookingStatus.CONFIRMED, saved.getStatus());
        assertNull(saved.getCancelledAt());
    }

    /**
     * Declining cancels, which is what frees the time: the unique key in the
     * schema only holds a slot while the booking is REQUESTED or CONFIRMED.
     */
    @Test
    void decliningCancelsAndRecordsWhy() {
        Booking saved = service.decide(1L, 99L, false, "away that week");
        assertEquals(BookingStatus.CANCELLED, saved.getStatus());
        assertNotNull(saved.getCancelledAt());
        assertEquals("away that week", saved.getCancellationReason());
    }

    @Test
    void anotherDoctorCannotDecide() {
        Doctor other = new Doctor();
        other.setId(8L);
        when(doctors.findByUserIdAndDeletedAtIsNull(2L)).thenReturn(Optional.of(other));

        assertThrows(AccessDeniedException.class, () -> service.decide(2L, 99L, true, null));
        verify(bookings, never()).save(any());
    }

    @Test
    void anAccountWithNoListingCannotDecide() {
        when(doctors.findByUserIdAndDeletedAtIsNull(3L)).thenReturn(Optional.empty());
        assertThrows(AccessDeniedException.class, () -> service.decide(3L, 99L, true, null));
    }

    /** A cancelled appointment does not get confirmed after the fact. */
    @Test
    void aSettledBookingCannotBeReopened() {
        booking.setStatus(BookingStatus.CANCELLED);
        assertThrows(IllegalStateException.class, () -> service.decide(1L, 99L, true, null));
        verify(bookings, never()).save(any());
    }
}
