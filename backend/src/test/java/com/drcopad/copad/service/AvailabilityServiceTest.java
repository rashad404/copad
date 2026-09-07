package com.drcopad.copad.service;

import com.drcopad.copad.entity.*;
import com.drcopad.copad.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.*;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * Which times are offered, and which must not be.
 *
 * Offering a slot that cannot be booked teaches people not to trust the
 * product; offering one nobody is watching teaches them something worse. Both
 * directions are pinned here.
 */
class AvailabilityServiceTest {

    private DoctorRepository doctors;
    private DoctorAvailabilityRepository availability;
    private DoctorTimeOffRepository timeOff;
    private BookingRepository bookings;
    private AvailabilityService service;

    private Doctor doctor;

    @BeforeEach
    void setUp() {
        doctors = mock(DoctorRepository.class);
        availability = mock(DoctorAvailabilityRepository.class);
        timeOff = mock(DoctorTimeOffRepository.class);
        bookings = mock(BookingRepository.class);
        service = new AvailabilityService(doctors, availability, timeOff, bookings);

        doctor = new Doctor();
        doctor.setId(1L);
        doctor.setActive(true);
        doctor.setAcceptsBookings(true);
        when(doctors.findByIdAndDeletedAtIsNull(1L)).thenReturn(Optional.of(doctor));
        when(timeOff.findByDoctorIdAndEndsAtAfterAndStartsAtBefore(anyLong(), any(), any()))
                .thenReturn(List.of());
        when(bookings.findByDoctorIdAndStatusInAndStartsAtBetween(anyLong(), any(), any(), any()))
                .thenReturn(List.of());
    }

    /** A block on the given day, 09:00 to 12:00, twenty minute slots. */
    private void morningOn(LocalDate day) {
        DoctorAvailability block = new DoctorAvailability();
        block.setDoctor(doctor);
        block.setDayOfWeek(day.getDayOfWeek().getValue());
        block.setStartTime(LocalTime.of(9, 0));
        block.setEndTime(LocalTime.of(12, 0));
        block.setSlotMinutes(20);
        block.setActive(true);
        when(availability.findByDoctorIdAndActiveTrue(1L)).thenReturn(List.of(block));
    }

    private LocalDate nextWeekOn(DayOfWeek d) {
        LocalDate day = LocalDate.now().plusDays(7);
        while (day.getDayOfWeek() != d) day = day.plusDays(1);
        return day;
    }

    @Test
    void aWorkingMorningIsOfferedAsSlots() {
        LocalDate day = nextWeekOn(DayOfWeek.TUESDAY);
        morningOn(day);

        var slots = service.slotsFor(1L, day, day);

        // Three hours in twenty minute slots.
        assertEquals(9, slots.size());
        assertEquals(LocalTime.of(9, 0), slots.get(0).startsAt().toLocalTime());
        assertEquals(LocalTime.of(11, 40), slots.get(8).startsAt().toLocalTime());
    }

    @Test
    void aDoctorNotTakingBookingsOffersNothing() {
        // A seeded listing nobody has claimed. A calendar leading nowhere is
        // worse than no calendar.
        LocalDate day = nextWeekOn(DayOfWeek.TUESDAY);
        morningOn(day);
        doctor.setAcceptsBookings(false);

        assertTrue(service.slotsFor(1L, day, day).isEmpty());
    }

    @Test
    void anInactiveOrDeletedDoctorOffersNothing() {
        LocalDate day = nextWeekOn(DayOfWeek.TUESDAY);
        morningOn(day);

        doctor.setActive(false);
        assertTrue(service.slotsFor(1L, day, day).isEmpty());

        doctor.setActive(true);
        doctor.setDeletedAt(LocalDateTime.now());
        assertTrue(service.slotsFor(1L, day, day).isEmpty());
    }

    @Test
    void aTakenSlotIsNotOfferedTwice() {
        LocalDate day = nextWeekOn(DayOfWeek.TUESDAY);
        morningOn(day);

        Booking taken = new Booking();
        taken.setStartsAt(day.atTime(9, 20));
        when(bookings.findByDoctorIdAndStatusInAndStartsAtBetween(anyLong(), any(), any(), any()))
                .thenReturn(List.of(taken));

        var slots = service.slotsFor(1L, day, day);
        assertEquals(8, slots.size());
        assertTrue(slots.stream().noneMatch(s -> s.startsAt().equals(day.atTime(9, 20))));
    }

    @Test
    void timeOffRemovesTheSlotsItCovers() {
        LocalDate day = nextWeekOn(DayOfWeek.TUESDAY);
        morningOn(day);

        DoctorTimeOff away = new DoctorTimeOff();
        away.setStartsAt(day.atTime(10, 0));
        away.setEndsAt(day.atTime(11, 0));
        when(timeOff.findByDoctorIdAndEndsAtAfterAndStartsAtBefore(anyLong(), any(), any()))
                .thenReturn(List.of(away));

        var slots = service.slotsFor(1L, day, day);
        assertTrue(slots.stream().noneMatch(s ->
                !s.startsAt().toLocalTime().isBefore(LocalTime.of(10, 0))
                        && s.startsAt().toLocalTime().isBefore(LocalTime.of(11, 0))));
        assertEquals(6, slots.size());
    }

    @Test
    void slotsTooSoonAreNotOffered() {
        // Nobody at the clinic will have seen a booking made ten minutes before
        // it starts.
        LocalDate today = LocalDate.now();
        DoctorAvailability allDay = new DoctorAvailability();
        allDay.setDoctor(doctor);
        allDay.setDayOfWeek(today.getDayOfWeek().getValue());
        allDay.setStartTime(LocalTime.of(0, 0));
        allDay.setEndTime(LocalTime.of(23, 40));
        allDay.setSlotMinutes(20);
        allDay.setActive(true);
        when(availability.findByDoctorIdAndActiveTrue(1L)).thenReturn(List.of(allDay));

        var slots = service.slotsFor(1L, today, today);
        assertTrue(slots.stream().allMatch(s -> s.startsAt().isAfter(LocalDateTime.now())));
    }

    @Test
    void anOvernightBlockIsSkippedRatherThanLoopingForever() {
        // Bad data should not hang the request.
        LocalDate day = nextWeekOn(DayOfWeek.TUESDAY);
        DoctorAvailability broken = new DoctorAvailability();
        broken.setDoctor(doctor);
        broken.setDayOfWeek(day.getDayOfWeek().getValue());
        broken.setStartTime(LocalTime.of(22, 0));
        broken.setEndTime(LocalTime.of(2, 0));
        broken.setSlotMinutes(20);
        broken.setActive(true);
        when(availability.findByDoctorIdAndActiveTrue(1L)).thenReturn(List.of(broken));

        assertTrue(service.slotsFor(1L, day, day).isEmpty());
    }

    @Test
    void aRequestForATimeNeverOfferedIsRejected() {
        LocalDate day = nextWeekOn(DayOfWeek.TUESDAY);
        morningOn(day);

        assertTrue(service.isOffered(1L, day.atTime(9, 0)));
        // Not on a slot boundary.
        assertFalse(service.isOffered(1L, day.atTime(9, 7)));
        // Outside the working block.
        assertFalse(service.isOffered(1L, day.atTime(15, 0)));
        assertFalse(service.isOffered(1L, null));
    }
}
