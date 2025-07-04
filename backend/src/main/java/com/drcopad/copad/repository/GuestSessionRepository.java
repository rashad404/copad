package com.drcopad.copad.repository;

import com.drcopad.copad.entity.GuestSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface GuestSessionRepository extends JpaRepository<GuestSession, String> {
    Optional<GuestSession> findBySessionId(String sessionId);

    @Modifying
    @Query("DELETE FROM GuestSession g WHERE g.lastActive < :cutoff AND g.id NOT IN (SELECT DISTINCT c.guestSession.id FROM Chat c WHERE c.guestSession IS NOT NULL)")
    void deleteExpiredSessions(@Param("cutoff") LocalDateTime cutoff);

    @Modifying
    @Query("UPDATE GuestSession g SET g.lastActive = CURRENT_TIMESTAMP WHERE g.sessionId = :sessionId")
    void updateLastActive(@Param("sessionId") String sessionId);

    @Query("SELECT g FROM GuestSession g ORDER BY g.createdAt DESC")
    List<GuestSession> findAllSessions();
} 