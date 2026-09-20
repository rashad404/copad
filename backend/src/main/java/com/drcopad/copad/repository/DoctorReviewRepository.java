package com.drcopad.copad.repository;

import com.drcopad.copad.entity.DoctorReview;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface DoctorReviewRepository extends JpaRepository<DoctorReview, Long> {

    /** What the public sees: published only, newest first. */
    @Query("SELECT r FROM DoctorReview r WHERE r.doctor.id = :doctorId "
            + "AND r.status = com.drcopad.copad.entity.DoctorReview$Status.PUBLISHED "
            + "ORDER BY r.createdAt DESC")
    Page<DoctorReview> published(@Param("doctorId") Long doctorId, Pageable pageable);

    /** One account reviews one doctor once. */
    Optional<DoctorReview> findByDoctorIdAndUserId(Long doctorId, Long userId);

    /** An attended appointment is evidence for exactly one review. */
    boolean existsByBookingId(Long bookingId);

    /** The moderation queue, oldest first: people are waiting on these. */
    Page<DoctorReview> findByStatusOrderByCreatedAtAsc(DoctorReview.Status status,
                                                       Pageable pageable);

    /** Everything counted into a doctor's rating. */
    @Query("SELECT r.rating FROM DoctorReview r WHERE r.doctor.id = :doctorId "
            + "AND r.status = com.drcopad.copad.entity.DoctorReview$Status.PUBLISHED")
    List<Integer> publishedRatings(@Param("doctorId") Long doctorId);

    /** How many reviews this machine has written lately, across all doctors. */
    @Query("SELECT COUNT(r) FROM DoctorReview r WHERE r.reporterHash = :hash "
            + "AND r.createdAt > :since")
    long countRecentFrom(@Param("hash") String hash,
                         @Param("since") java.time.LocalDateTime since);
}
