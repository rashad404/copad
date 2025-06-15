package com.drcopad.copad.entity.responses;

import com.drcopad.copad.entity.ChatMessage;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "openai_responses", indexes = {
    @Index(name = "idx_response_id", columnList = "responseId"),
    @Index(name = "idx_conversation_id", columnList = "conversationId"),
    @Index(name = "idx_chat_message_id", columnList = "chat_message_id"),
    @Index(name = "idx_previous_response_id", columnList = "previousResponseId")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OpenAIResponse {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "response_id", nullable = false, unique = true)
    private String responseId;
    
    @Column(name = "conversation_id", nullable = false)
    private String conversationId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "conversation_id", referencedColumnName = "conversationId", 
                insertable = false, updatable = false)
    private Conversation conversation;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chat_message_id", nullable = false)
    private ChatMessage chatMessage;
    
    @Column(name = "previous_response_id")
    private String previousResponseId;
    
    @Column(nullable = false, length = 50)
    private String model;
    
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "tools_used", columnDefinition = "LONGTEXT")
    private List<String> toolsUsed;
    
    @Column(name = "completion_tokens")
    @Builder.Default
    private Integer completionTokens = 0;
    
    @Column(name = "prompt_tokens")
    @Builder.Default
    private Integer promptTokens = 0;
    
    @Column(name = "total_tokens")
    @Builder.Default
    private Integer totalTokens = 0;
    
    @Column(name = "response_time_ms")
    private Integer responseTimeMs;
    
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @PostPersist
    @PostUpdate
    public void calculateTotalTokens() {
        if (promptTokens != null && completionTokens != null) {
            totalTokens = promptTokens + completionTokens;
        }
    }
}