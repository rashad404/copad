package com.drcopad.copad.service;

import com.drcopad.copad.entity.*;
import com.drcopad.copad.repository.*;
import com.drcopad.copad.service.notification.NotificationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * What happens to the evidence somebody sends to claim their own listing.
 *
 * It is written to prove who they are: a licence number, a place of work, a
 * phone. It used to be put into the bio when the listing had none, which
 * published it to anyone who opened the profile, while the reviewer who needed
 * it never saw it. Both halves of that are tested here.
 */
class DoctorClaimEvidenceTest {

    private DoctorRepository doctors;
    private UserRepository users;
    private DoctorSelfService service;
    private Doctor doctor;
    private User user;

    @BeforeEach
    void setUp() {
        doctors = mock(DoctorRepository.class);
        users = mock(UserRepository.class);
        service = new DoctorSelfService(
                doctors,
                mock(DoctorAvailabilityRepository.class),
                mock(ClinicRepository.class),
                mock(BookingRepository.class),
                mock(DoctorTimeOffRepository.class),
                users,
                mock(NotificationService.class));

        doctor = new Doctor();
        doctor.setId(7L);
        doctor.setFullName("Dr Test");
        doctor.setVerification(VerificationStatus.UNCLAIMED);

        user = new User();
        user.setId(3L);
        user.setEmail("doctor@example.com");

        when(doctors.findByUserIdAndDeletedAtIsNull(3L)).thenReturn(Optional.empty());
        when(doctors.findByIdAndDeletedAtIsNull(7L)).thenReturn(Optional.of(doctor));
        when(users.findById(3L)).thenReturn(Optional.of(user));
        when(doctors.save(any(Doctor.class))).thenAnswer(i -> i.getArgument(0));
    }

    @Test
    void evidenceIsKeptForTheReviewerAndNeverPublished() {
        Doctor claimed = service.claim(7L, 3L, "  Licence AZ-4471, Liv Bona Dea, 050 111 22 33  ");

        assertEquals("Licence AZ-4471, Liv Bona Dea, 050 111 22 33", claimed.getClaimEvidence());
        assertNull(claimed.getBio(), "evidence must never reach the public bio");
        assertNotNull(claimed.getClaimedAt());
        assertEquals(VerificationStatus.PENDING, claimed.getVerification());
        // A claim is not a credential: still no appointments.
        assertFalse(claimed.isAcceptsBookings());
    }

    @Test
    void anExistingBioIsLeftAlone() {
        doctor.setBio("Fəaliyyət sahələri: Ümumi müalicə.");

        Doctor claimed = service.claim(7L, 3L, "Licence AZ-4471");

        assertEquals("Fəaliyyət sahələri: Ümumi müalicə.", claimed.getBio());
    }

    @Test
    void anEmptyEvidenceIsStoredAsNothing() {
        Doctor claimed = service.claim(7L, 3L, "   ");

        assertNull(claimed.getClaimEvidence());
        assertNull(claimed.getBio());
    }
}
