package com.drcopad.copad.service;

import com.drcopad.copad.entity.*;
import com.drcopad.copad.repository.BookingRepository;
import com.drcopad.copad.repository.DoctorRepository;
import com.drcopad.copad.repository.DoctorReviewRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

/**
 * Which reviews a reader is asked to believe.
 *
 * The badge on a review is the only thing separating this from the
 * directories full of invented five star ratings, so it is decided from what
 * we can prove and never from what the browser sends. These are the four
 * cases that decide it.
 */
class DoctorReviewTrustTest {

    private DoctorReviewRepository reviews;
    private DoctorRepository doctors;
    private BookingRepository bookings;
    private DoctorReviewService service;

    private Doctor doctor;
    private User user;

    @BeforeEach
    void setUp() {
        reviews = mock(DoctorReviewRepository.class);
        doctors = mock(DoctorRepository.class);
        bookings = mock(BookingRepository.class);
        service = new DoctorReviewService(reviews, doctors, bookings);
        ReflectionTestUtils.setField(service, "autoPublishRegistered", true);

        doctor = new Doctor();
        doctor.setId(7L);
        doctor.setSlug("dr-test");
        doctor.setActive(true);
        doctor.setVerification(VerificationStatus.UNCLAIMED);

        user = new User();
        user.setId(3L);
        user.setName("Nurlan");

        when(doctors.findBySlugAndDeletedAtIsNull("dr-test")).thenReturn(Optional.of(doctor));
        when(doctors.findById(7L)).thenReturn(Optional.of(doctor));
        when(reviews.publishedRatings(7L)).thenReturn(List.of());
        when(reviews.countRecentFrom(anyString(), any())).thenReturn(0L);
        when(reviews.findByDoctorIdAndUserId(any(), any())).thenReturn(Optional.empty());
        when(bookings.findByBookedByIdOrderByStartsAtDesc(3L)).thenReturn(List.of());
        when(reviews.save(any(DoctorReview.class))).thenAnswer(i -> i.getArgument(0));
    }

    private DoctorReviewService.NewReview review() {
        return new DoctorReviewService.NewReview(5, "Yaxşı həkimdir", "Nurlan");
    }

    @Test
    void somebodyWithNoAccountIsAGuestAndWaitsForAModerator() {
        DoctorReview saved = service.write("dr-test", review(), null, "5.44.32.10");

        assertEquals(DoctorReview.Trust.GUEST, saved.getTrust());
        assertEquals(DoctorReview.Status.PENDING, saved.getStatus(),
                "a guest review must be read by a person before it is published");
        assertNull(saved.getPublishedAt());
    }

    @Test
    void anAccountWithNoVisitIsRegistered() {
        DoctorReview saved = service.write("dr-test", review(), user, "5.44.32.10");

        assertEquals(DoctorReview.Trust.REGISTERED, saved.getTrust());
        assertEquals(DoctorReview.Status.PUBLISHED, saved.getStatus());
    }

    @Test
    void anAttendedAppointmentMakesItVerified() {
        Booking attended = new Booking();
        attended.setId(11L);
        attended.setDoctor(doctor);
        attended.setStatus(BookingStatus.COMPLETED);
        attended.setStartsAt(LocalDateTime.now().minusDays(2));
        when(bookings.findByBookedByIdOrderByStartsAtDesc(3L)).thenReturn(List.of(attended));

        DoctorReview saved = service.write("dr-test", review(), user, "5.44.32.10");

        assertEquals(DoctorReview.Trust.VERIFIED, saved.getTrust());
        assertEquals(11L, saved.getBooking().getId());
        assertEquals(DoctorReview.Status.PUBLISHED, saved.getStatus());
    }

    @Test
    void anAppointmentWithSomebodyElseIsNotEvidence() {
        Doctor otherDoctor = new Doctor();
        otherDoctor.setId(99L);
        Booking elsewhere = new Booking();
        elsewhere.setId(12L);
        elsewhere.setDoctor(otherDoctor);
        elsewhere.setStatus(BookingStatus.COMPLETED);
        elsewhere.setStartsAt(LocalDateTime.now().minusDays(2));
        when(bookings.findByBookedByIdOrderByStartsAtDesc(3L)).thenReturn(List.of(elsewhere));

        DoctorReview saved = service.write("dr-test", review(), user, "5.44.32.10");

        assertEquals(DoctorReview.Trust.REGISTERED, saved.getTrust());
        assertNull(saved.getBooking());
    }

    @Test
    void anAppointmentStillToHappenIsNotEvidence() {
        Booking upcoming = new Booking();
        upcoming.setId(13L);
        upcoming.setDoctor(doctor);
        upcoming.setStatus(BookingStatus.CONFIRMED);
        upcoming.setStartsAt(LocalDateTime.now().plusDays(3));
        when(bookings.findByBookedByIdOrderByStartsAtDesc(3L)).thenReturn(List.of(upcoming));

        DoctorReview saved = service.write("dr-test", review(), user, "5.44.32.10");

        assertEquals(DoctorReview.Trust.REGISTERED, saved.getTrust(),
                "an appointment nobody has attended yet proves nothing");
    }

    @Test
    void oneAccountReviewsOneDoctorOnce() {
        when(reviews.findByDoctorIdAndUserId(7L, 3L))
                .thenReturn(Optional.of(new DoctorReview()));

        assertThrows(IllegalStateException.class,
                () -> service.write("dr-test", review(), user, "5.44.32.10"));
    }

    @Test
    void oneMachineCannotWriteAllDay() {
        when(reviews.countRecentFrom(anyString(), any())).thenReturn(5L);

        assertThrows(IllegalStateException.class,
                () -> service.write("dr-test", review(), null, "5.44.32.10"));
    }

    @Test
    void aRatingOutsideOneToFiveIsRefused() {
        for (int rating : new int[] {0, 6, -1}) {
            assertThrows(IllegalArgumentException.class, () -> service.write("dr-test",
                    new DoctorReviewService.NewReview(rating, "x", "Nurlan"), user, "5.44.32.10"));
        }
    }

    @Test
    void theRatingIsCountedFromPublishedReviewsRatherThanAddedUp() {
        when(reviews.publishedRatings(7L)).thenReturn(List.of(5, 4, 3));

        service.recount(7L);

        assertEquals(3, doctor.getReviewCount());
        assertEquals(12, doctor.getRatingTotal());
    }
}
