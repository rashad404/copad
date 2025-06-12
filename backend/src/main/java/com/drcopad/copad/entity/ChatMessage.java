package com.drcopad.copad.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@Table(name = "chat_messages")
public class ChatMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "appointment_id")
    private Appointment appointment;
    
    @ManyToOne
    @JoinColumn(name = "chat_id")
    private Chat chat;
    
    private String sender; // "USER" or "AI"
    
    @Lob
    @Column(columnDefinition = "TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
    private String message;

    private LocalDateTime timestamp;
    
    @ManyToOne
    @JoinColumn(name = "guest_session_id")
    private GuestSession guestSession;
    
    @OneToMany(mappedBy = "message", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<FileAttachment> attachments = new ArrayList<>();
    
    @PrePersist
    protected void onCreate() {
        if (this.timestamp == null) {
            this.timestamp = LocalDateTime.now();
        }
    }
    
    public void addAttachment(FileAttachment attachment) {
        attachments.add(attachment);
        attachment.setMessage(this);
    }
    
    public void removeAttachment(FileAttachment attachment) {
        attachments.remove(attachment);
        attachment.setMessage(null);
    }
}