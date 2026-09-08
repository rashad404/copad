package com.drcopad.copad.repository;

import com.drcopad.copad.entity.Notification;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    /** Anything due and not yet delivered, oldest first. */
    @Query("SELECT n FROM Notification n WHERE n.status = 'PENDING' "
            + "AND n.scheduledFor <= :now AND n.attempts < :maxAttempts "
            + "ORDER BY n.scheduledFor ASC")
    List<Notification> due(@Param("now") LocalDateTime now,
                           @Param("maxAttempts") int maxAttempts,
                           Pageable pageable);

    boolean existsByUserIdAndKindAndBookingId(Long userId, Notification.Kind kind, Long bookingId);
}
