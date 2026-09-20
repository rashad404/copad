package com.drcopad.copad.service;

import com.drcopad.copad.entity.*;
import com.drcopad.copad.entity.DoctorReview.Status;
import com.drcopad.copad.entity.DoctorReview.Trust;
import com.drcopad.copad.repository.BookingRepository;
import com.drcopad.copad.repository.DoctorRepository;
import com.drcopad.copad.repository.DoctorReviewRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.LocalDateTime;
import java.util.HexFormat;
import java.util.List;
import java.util.Optional;

/**
 * Writing, reading and moderating what patients say about a doctor.
 *
 * Two rules hold this together.
 *
 * The trust level is decided here from what we can prove, never from what the
 * browser claims. An account makes a review REGISTERED; an attended
 * appointment booked through azdoc makes it VERIFIED; everything else is a
 * GUEST review. It is the only thing on the page a reader is asked to trust,
 * so it cannot be an input.
 *
 * A guest review is read by a person before anybody else sees it. Every
 * directory in this market is full of invented five star ratings, and the way
 * not to become one is to make the cheapest kind of review the slowest to
 * appear.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class DoctorReviewService {

    public static final int MAX_COMMENT = 2000;
    private static final int MAX_NAME = 120;

    /** One machine, this many reviews a day, before we stop listening. */
    private static final int MAX_PER_MACHINE_PER_DAY = 5;

    private final DoctorReviewRepository reviews;
    private final DoctorRepository doctors;
    private final BookingRepository bookings;

    /**
     * Whether a review from an account appears immediately.
     *
     * On by default: an account with an attended appointment behind it is not
     * the problem, and holding those makes the page look dead while the honest
     * reviews queue up.
     */
    @Value("${app.reviews.auto-publish-registered:true}")
    private boolean autoPublishRegistered;

    public record NewReview(int rating, String comment, String authorName) {
    }

    /**
     * Records a review and says whether anybody can see it yet.
     */
    @Transactional
    public DoctorReview write(String doctorSlug, NewReview input, User author, String readerIp) {
        int rating = input.rating();
        if (rating < 1 || rating > 5) {
            throw new IllegalArgumentException("A rating between 1 and 5 is needed");
        }

        Doctor doctor = doctors.findBySlugAndDeletedAtIsNull(doctorSlug)
                .filter(Doctor::isActive)
                .filter(d -> d.getVerification() != VerificationStatus.REJECTED)
                .orElseThrow(() -> new IllegalArgumentException("Doctor not found"));

        String hash = fingerprint(readerIp);
        if (hash != null && reviews.countRecentFrom(hash, LocalDateTime.now().minusDays(1))
                >= MAX_PER_MACHINE_PER_DAY) {
            throw new IllegalStateException("Too many reviews from here today");
        }

        if (author != null && reviews.findByDoctorIdAndUserId(doctor.getId(), author.getId())
                .isPresent()) {
            throw new IllegalStateException("You have already reviewed this doctor");
        }

        // The evidence, if there is any: an appointment with this doctor that
        // the person actually attended.
        Optional<Booking> attended = author == null
                ? Optional.empty()
                : attendedAppointment(doctor.getId(), author.getId());

        DoctorReview review = new DoctorReview();
        review.setDoctor(doctor);
        review.setRating(rating);
        review.setComment(trim(input.comment(), MAX_COMMENT));
        review.setUser(author);
        review.setReporterHash(hash);

        if (attended.isPresent()) {
            review.setTrust(Trust.VERIFIED);
            review.setBooking(attended.get());
        } else if (author != null) {
            review.setTrust(Trust.REGISTERED);
        } else {
            review.setTrust(Trust.GUEST);
        }

        String name = trim(input.authorName(), MAX_NAME);
        if (author != null && (name == null || name.isBlank())) name = author.getName();
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("A name is needed");
        }
        review.setAuthorName(name);

        // A verified review is evidence of a visit; a registered one is an
        // account standing behind an opinion. A guest review is neither, so a
        // person reads it first.
        boolean publishNow = review.getTrust() == Trust.VERIFIED
                || (review.getTrust() == Trust.REGISTERED && autoPublishRegistered);
        review.setStatus(publishNow ? Status.PUBLISHED : Status.PENDING);
        if (publishNow) review.setPublishedAt(LocalDateTime.now());

        DoctorReview saved = reviews.save(review);
        if (publishNow) recount(doctor.getId());
        // No comment text and no name in the log: it is somebody's opinion of
        // a named person.
        log.info("Review {} for doctor {} recorded as {} / {}",
                saved.getId(), doctor.getId(), saved.getTrust(), saved.getStatus());
        return saved;
    }

    @Transactional(readOnly = true)
    public Page<DoctorReview> published(Long doctorId, int page, int size) {
        return reviews.published(doctorId, PageRequest.of(Math.max(page, 0),
                Math.min(Math.max(size, 1), 50)));
    }

    @Transactional(readOnly = true)
    public Page<DoctorReview> awaitingModeration(Pageable pageable) {
        return reviews.findByStatusOrderByCreatedAtAsc(Status.PENDING, pageable);
    }

    /** Publishes or refuses one review, and recounts the doctor either way. */
    @Transactional
    public DoctorReview moderate(Long reviewId, boolean publish, String note) {
        DoctorReview review = reviews.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("Review not found"));
        review.setStatus(publish ? Status.PUBLISHED : Status.REJECTED);
        review.setModerationNote(trim(note, 255));
        review.setPublishedAt(publish ? LocalDateTime.now() : null);
        DoctorReview saved = reviews.save(review);
        recount(review.getDoctor().getId());
        return saved;
    }

    /**
     * Recomputes a doctor's rating from the reviews themselves.
     *
     * Counted rather than incremented: a review can be published today and
     * withdrawn tomorrow, and a running total drifts away from the truth the
     * first time that happens.
     */
    @Transactional
    public void recount(Long doctorId) {
        List<Integer> ratings = reviews.publishedRatings(doctorId);
        doctors.findById(doctorId).ifPresent(doctor -> {
            doctor.setReviewCount(ratings.size());
            doctor.setRatingTotal(ratings.stream().mapToInt(Integer::intValue).sum());
            doctors.save(doctor);
        });
    }

    /**
     * An appointment with this doctor that the person attended.
     *
     * COMPLETED is the honest signal. A confirmed appointment in the past is
     * accepted too, because clinics do not always close them off, and refusing
     * every review from somebody who actually sat in the room would be worse
     * than occasionally trusting one who did not.
     */
    private Optional<Booking> attendedAppointment(Long doctorId, Long userId) {
        return bookings.findByBookedByIdOrderByStartsAtDesc(userId).stream()
                .filter(b -> b.getDoctor() != null && doctorId.equals(b.getDoctor().getId()))
                .filter(b -> b.getStatus() == BookingStatus.COMPLETED
                        || (b.getStatus() == BookingStatus.CONFIRMED
                            && b.getStartsAt().isBefore(LocalDateTime.now())))
                .filter(b -> !reviews.existsByBookingId(b.getId()))
                .findFirst();
    }

    private static String trim(String value, int max) {
        if (value == null) return null;
        String trimmed = value.trim();
        if (trimmed.isEmpty()) return null;
        return trimmed.length() > max ? trimmed.substring(0, max) : trimmed;
    }

    /**
     * A one way fingerprint of the address.
     *
     * Enough to notice one machine writing ten reviews; not enough to say who
     * wrote what about whom, which is not something this table should be able
     * to answer.
     */
    private static String fingerprint(String ip) {
        if (ip == null || ip.isBlank()) return null;
        try {
            byte[] digest = MessageDigest.getInstance("SHA-256")
                    .digest(("azdoc-review:" + ip).getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(digest);
        } catch (Exception e) {
            return null;
        }
    }
}
