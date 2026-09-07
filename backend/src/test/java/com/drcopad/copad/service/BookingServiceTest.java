package com.drcopad.copad.service;

import com.drcopad.copad.entity.*;
import com.drcopad.copad.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.dao.DataIntegrityViolationException;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * What may become an appointment, and what may not.
 *
 * A booking that is not real is worse than no booking: somebody arrives at a
 * clinic expecting to be seen. Every case here is about refusing to create one.
 */
class BookingServiceTest {

    private BookingRepository bookings;
    private DoctorRepository doctors;
    private FamilyService familyService;
    private AvailabilityService availability;
    private BookingService service;

    private Doctor doctor;
    private final LocalDateTime when = LocalDateTime.now().plusDays(3).withHour(10).withMinute(0);

    @BeforeEach
    void setUp() {
        bookings = mock(BookingRepository.class);
        doctors = mock(DoctorRepository.class);
        familyService = mock(FamilyService.class);
        availability = mock(AvailabilityService.class);

        service = new BookingService(bookings, doctors, mock(ClinicRepository.class),
                familyService, mock(UserRepository.class), availability);

        doctor = new Doctor();
        doctor.setId(1L);
        doctor.setActive(true);
        doctor.setAcceptsBookings(true);

        when(doctors.findByIdAndDeletedAtIsNull(1L)).thenReturn(Optional.of(doctor));
        when(familyService.requireMemberAccess(anyLong(), anyLong(), anyBoolean()))
                .thenReturn(new FamilyMember());
        when(availability.isOffered(eq(1L), any())).thenReturn(true);
        when(availability.slotsFor(anyLong(), any(), any())).thenReturn(java.util.List.of());
        when(bookings.saveAndFlush(any())).thenAnswer(i -> i.getArgument(0));
    }

    @Test
    void aDoctorNotTakingBookingsCannotBeBooked() {
        // A seeded listing nobody is watching. Someone who turns up to this
        // appointment is worse off than someone who never booked.
        doctor.setAcceptsBookings(false);

        var thrown = assertThrows(IllegalArgumentException.class,
                () -> service.book(1L, 2L, 3L, null, when, "check-up", false));
        assertTrue(thrown.getMessage().toLowerCase().contains("not taking"));
        verify(bookings, never()).saveAndFlush(any());
    }

    @Test
    void aTimeThatWasNeverOfferedIsRefused() {
        // A client can post any time it likes; only what availability offers
        // may become an appointment.
        when(availability.isOffered(eq(1L), any())).thenReturn(false);

        assertThrows(BookingService.SlotTakenException.class,
                () -> service.book(1L, 2L, 3L, null, when, null, false));
        verify(bookings, never()).saveAndFlush(any());
    }

    @Test
    void losingTheRaceIsReportedAsATakenSlotRatherThanAnError() {
        // Two people reaching for the last slot is the ordinary case. The
        // database refuses the second; this turns that into something a person
        // can act on.
        when(bookings.saveAndFlush(any())).thenThrow(
                new DataIntegrityViolationException("uq_booking_slot"));

        var thrown = assertThrows(BookingService.SlotTakenException.class,
                () -> service.book(1L, 2L, 3L, null, when, null, false));
        assertTrue(thrown.getMessage().toLowerCase().contains("just taken"));
    }

    @Test
    void bookingRequiresWriteAccessToThePerson() {
        service.book(1L, 2L, 3L, null, when, null, false);
        // An appointment is made on somebody's behalf, so reading their record
        // is not enough.
        verify(familyService).requireMemberAccess(2L, 3L, true);
    }

    @Test
    void sharingTheRecordIsPerBooking() {
        Booking shared = service.book(1L, 2L, 3L, null, when, null, true);
        assertTrue(shared.isSharedRecord());

        Booking notShared = service.book(1L, 2L, 3L, null, when, null, false);
        assertFalse(notShared.isSharedRecord());
    }

    @Test
    void aNewBookingStartsAsRequestedNotConfirmed() {
        // Nobody at the clinic has accepted it yet, and saying otherwise would
        // promise something we cannot.
        assertEquals(BookingStatus.REQUESTED,
                service.book(1L, 2L, 3L, null, when, null, false).getStatus());
    }

    @Test
    void cancellingAnAlreadyCancelledBookingIsRefused() {
        Booking existing = new Booking();
        existing.setId(9L);
        existing.setStatus(BookingStatus.CANCELLED);
        existing.setFamilyMember(new FamilyMember());
        when(bookings.findById(9L)).thenReturn(Optional.of(existing));

        assertThrows(IllegalArgumentException.class, () -> service.cancel(9L, 3L, "changed mind"));
    }

    @Test
    void cancellingKeepsTheRow() {
        // A cancelled appointment is part of what happened, and the clinic may
        // need to know it existed.
        Booking existing = new Booking();
        existing.setId(9L);
        existing.setStatus(BookingStatus.CONFIRMED);
        existing.setFamilyMember(new FamilyMember());
        when(bookings.findById(9L)).thenReturn(Optional.of(existing));
        when(bookings.save(any())).thenAnswer(i -> i.getArgument(0));

        Booking cancelled = service.cancel(9L, 3L, "changed mind");
        assertEquals(BookingStatus.CANCELLED, cancelled.getStatus());
        assertNotNull(cancelled.getCancelledAt());
        verify(bookings, never()).delete(any());
    }
}
