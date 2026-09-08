package com.drcopad.copad.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * Somebody telling us an answer was wrong.
 *
 * Required by Google Play for anything that generates content with AI, and
 * useful for its own sake: it is the only way we find out that the assistant
 * said something harmful to a real person.
 *
 * The message is referenced rather than copied. It is already stored once, it
 * is the person's own conversation, and duplicating it into a moderation table
 * would put clinical content somewhere it does not need to be.
 */
@Entity
@Table(name = "answer_report")
@Getter
@Setter
public class AnswerReport {

    public enum Reason { WRONG, HARMFUL, OFFENSIVE, OTHER }

    public enum Status { OPEN, REVIEWED, ACTIONED }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "chat_message_id", nullable = false)
    private ChatMessage chatMessage;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 24)
    private Reason reason = Reason.OTHER;

    /** What the person chose to add. Theirs, and optional. */
    @Column(length = 1000)
    private String note;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reported_by_user_id")
    private User reportedBy;

    @Column(name = "guest_session_id")
    private String guestSessionId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    private Status status = Status.OPEN;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "reviewed_at")
    private LocalDateTime reviewedAt;

    @PrePersist
    void onCreate() {
        if (createdAt == null) createdAt = LocalDateTime.now();
    }
}
