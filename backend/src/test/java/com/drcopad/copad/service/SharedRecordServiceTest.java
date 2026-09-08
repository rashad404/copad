package com.drcopad.copad.service;

import com.drcopad.copad.entity.*;
import com.drcopad.copad.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.access.AccessDeniedException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * The rules that decide whether a doctor may read somebody's record.
 *
 * Each of these is a separate way access could be wrongly granted, and the
 * whole point of the feature is that consent means what it says.
 */
class SharedRecordServiceTest {

    private BookingRepository bookings;
    private DoctorRepository doctors;
    private RecordAccessRepository accesses;
    private SharedRecordService service;

    private Doctor doctor;
    private Booking booking;
    private FamilyMember member;

    @BeforeEach
    void setUp() {
        bookings = mock(BookingRepository.class);
        doctors = mock(DoctorRepository.class);
        accesses = mock(RecordAccessRepository.class);

        service = new SharedRecordService(bookings, doctors, accesses,
                mock(MedicalConditionRepository.class), mock(AllergyRepository.class),
                mock(MedicationRepository.class), mock(ImmunizationRepository.class),
                mock(LabResultRepository.class), mock(VitalReadingRepository.class));

        doctor = new Doctor();
        doctor.setId(7L);
        when(doctors.findByUserIdAndDeletedAtIsNull(5L)).thenReturn(Optional.of(doctor));

        member = new FamilyMember();
        member.setId(21L);
        member.setFullName("Alim Mirzayev");

        booking = new Booking();
        booking.setId(1L);
        booking.setDoctor(doctor);
        booking.setFamilyMember(member);
        booking.setSharedRecord(true);
        booking.setStatus(BookingStatus.CONFIRMED);
        booking.setEndsAt(LocalDateTime.now().plusDays(1));
        when(bookings.findById(1L)).thenReturn(Optional.of(booking));
    }

    @Test
    void aSharedRecordIsReadableByTheDoctorItWasSharedWith() {
        Map<String, Object> record = service.forBooking(5L, 1L);

        assertThat(record.get("patientName")).isEqualTo("Alim Mirzayev");
        // Reading it is recorded, so the person who shared can see who looked.
        verify(accesses).save(any(RecordAccess.class));
    }

    @Test
    void aRecordThatWasNotSharedIsRefused() {
        booking.setSharedRecord(false);

        assertThatThrownBy(() -> service.forBooking(5L, 1L))
                .isInstanceOf(AccessDeniedException.class);
        verify(accesses, never()).save(any());
    }

    /** The booking form promises this: cancelling stops the sharing. */
    @Test
    void cancellingTheAppointmentEndsTheAccess() {
        booking.setStatus(BookingStatus.CANCELLED);

        assertThatThrownBy(() -> service.forBooking(5L, 1L))
                .isInstanceOf(AccessDeniedException.class);
        verify(accesses, never()).save(any());
    }

    @Test
    void anotherDoctorCannotReadIt() {
        Doctor other = new Doctor();
        other.setId(99L);
        when(doctors.findByUserIdAndDeletedAtIsNull(6L)).thenReturn(Optional.of(other));

        assertThatThrownBy(() -> service.forBooking(6L, 1L))
                .isInstanceOf(AccessDeniedException.class);
    }

    @Test
    void anAccountWithNoListingCannotReadIt() {
        when(doctors.findByUserIdAndDeletedAtIsNull(404L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.forBooking(404L, 1L))
                .isInstanceOf(AccessDeniedException.class);
    }

    /**
     * Consent for an appointment was not consent for permanent access. A doctor
     * writing up the visit needs it for a while; nobody needs it next year.
     */
    @Test
    void accessLapsesAfterTheAppointmentIsWellPast() {
        booking.setEndsAt(LocalDateTime.now().minusDays(30));

        assertThatThrownBy(() -> service.forBooking(5L, 1L))
                .isInstanceOf(AccessDeniedException.class);
        verify(accesses, never()).save(any());
    }

    @Test
    void accessSurvivesTheDaysImmediatelyAfterTheVisit() {
        booking.setEndsAt(LocalDateTime.now().minusDays(2));

        assertThat(service.forBooking(5L, 1L)).containsKey("patientName");
    }
}
