package com.drcopad.copad.entity.responses;

import com.drcopad.copad.entity.Chat;
import com.drcopad.copad.entity.GuestSession;
import com.drcopad.copad.entity.User;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "conversations", indexes = {
    @Index(name = "idx_conversation_id", columnList = "conversationId"),
    @Index(name = "idx_chat_id", columnList = "chatId"),
    @Index(name = "idx_user_id", columnList = "user_id"),
    @Index(name = "idx_guest_session_id", columnList = "guest_session_id"),
    @Index(name = "idx_expires_at", columnList = "expiresAt"),
    @Index(name = "idx_status", columnList = "status"),
    @Index(name = "idx_conv_expiry_status", columnList = "expiresAt,status")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Conversation {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "conversation_id", nullable = false, unique = true)
    private String conversationId;
    
    @Column(nullable = false)
    private String chatId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "guest_session_id")
    private GuestSession guestSession;
    
    @Column(name = "last_openai_response_id")
    private String lastOpenaiResponseId;
    
    @Column(nullable = false, length = 50)
    @Builder.Default
    private String model = "o3";
    
    @Column(name = "specialty_code", length = 50)
    private String specialtyCode;
    
    @Column(length = 10)
    @Builder.Default
    private String language = "en";
    
    @Column(nullable = false, length = 20)
    @Builder.Default
    private String status = "active";
    
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(insertable = false)
    private LocalDateTime updatedAt;
    
    @Column(nullable = false)
    private LocalDateTime expiresAt;
    
    @OneToMany(mappedBy = "conversation", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<OpenAIResponse> responses = new ArrayList<>();
    
    @OneToMany(mappedBy = "conversation", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ConversationFile> conversationFiles = new ArrayList<>();
    
    @OneToMany(mappedBy = "conversation", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<UsageMetric> usageMetrics = new ArrayList<>();
    
    @PrePersist
    public void prePersist() {
        if (conversationId == null) {
            conversationId = "conv_" + UUID.randomUUID().toString();
        }
        if (expiresAt == null) {
            expiresAt = LocalDateTime.now().plusDays(30);
        }
    }
    
    public boolean isExpired() {
        return LocalDateTime.now().isAfter(expiresAt) || "expired".equals(status);
    }
    
    public void expire() {
        this.status = "expired";
    }
}