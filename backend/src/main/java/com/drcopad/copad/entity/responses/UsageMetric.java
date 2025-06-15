package com.drcopad.copad.entity.responses;

import com.drcopad.copad.entity.GuestSession;
import com.drcopad.copad.entity.User;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "usage_metrics", indexes = {
    @Index(name = "idx_conversation_id", columnList = "conversationId"),
    @Index(name = "idx_response_id", columnList = "responseId"),
    @Index(name = "idx_user_id", columnList = "user_id"),
    @Index(name = "idx_guest_session_id", columnList = "guest_session_id"),
    @Index(name = "idx_api_type", columnList = "apiType"),
    @Index(name = "idx_created_at", columnList = "createdAt"),
    @Index(name = "idx_usage_date_user", columnList = "createdAt,user_id"),
    @Index(name = "idx_usage_date_guest", columnList = "createdAt,guest_session_id")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UsageMetric {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "conversation_id", nullable = false)
    private String conversationId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "conversation_id", referencedColumnName = "conversationId", 
                insertable = false, updatable = false)
    private Conversation conversation;
    
    @Column(name = "response_id")
    private String responseId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "guest_session_id")
    private GuestSession guestSession;
    
    @Column(nullable = false, length = 50)
    private String model;
    
    @Column(name = "input_tokens", nullable = false)
    @Builder.Default
    private Integer inputTokens = 0;
    
    @Column(name = "output_tokens", nullable = false)
    @Builder.Default
    private Integer outputTokens = 0;
    
    @Column(name = "total_tokens", nullable = false)
    @Builder.Default
    private Integer totalTokens = 0;
    
    @Column(name = "input_cost", precision = 10, scale = 6)
    @Builder.Default
    private BigDecimal inputCost = BigDecimal.ZERO;
    
    @Column(name = "output_cost", precision = 10, scale = 6)
    @Builder.Default
    private BigDecimal outputCost = BigDecimal.ZERO;
    
    @Column(name = "total_cost", precision = 10, scale = 6)
    @Builder.Default
    private BigDecimal totalCost = BigDecimal.ZERO;
    
    @Column(name = "tools_cost", precision = 10, scale = 6)
    @Builder.Default
    private BigDecimal toolsCost = BigDecimal.ZERO;
    
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "tools_used", columnDefinition = "LONGTEXT")
    private List<String> toolsUsed;
    
    @Column(name = "api_type", nullable = false, length = 20)
    @Builder.Default
    private String apiType = "responses";
    
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @PostPersist
    @PostUpdate
    public void calculateTotals() {
        if (inputTokens != null && outputTokens != null) {
            totalTokens = inputTokens + outputTokens;
        }
        if (inputCost != null && outputCost != null && toolsCost != null) {
            totalCost = inputCost.add(outputCost).add(toolsCost);
        }
    }
}