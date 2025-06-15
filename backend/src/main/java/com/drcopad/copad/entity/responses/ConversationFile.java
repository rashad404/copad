package com.drcopad.copad.entity.responses;

import com.drcopad.copad.entity.FileAttachment;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.Map;

@Entity
@Table(name = "conversation_files", indexes = {
    @Index(name = "idx_conversation_id", columnList = "conversationId"),
    @Index(name = "idx_file_attachment_id", columnList = "file_attachment_id"),
    @Index(name = "idx_openai_file_id", columnList = "openaiFileId"),
    @Index(name = "idx_category", columnList = "category"),
    @Index(name = "idx_status", columnList = "status")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConversationFile {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "conversation_id", nullable = false)
    private String conversationId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "conversation_id", referencedColumnName = "conversation_id", 
                insertable = false, updatable = false,
                foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
    private Conversation conversation;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "file_attachment_id", nullable = false)
    private FileAttachment fileAttachment;
    
    @Column(name = "openai_file_id")
    private String openaiFileId;
    
    @Column(nullable = false, length = 50)
    @Builder.Default
    private String category = "general";
    
    @Column(nullable = false, length = 20)
    @Builder.Default
    private String status = "uploaded";
    
    @Column(name = "processing_details", columnDefinition = "LONGTEXT")
    @Convert(converter = JsonMapConverter.class)
    private Map<String, Object> processingDetails;
    
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime uploadedAt;
    
    @Column(name = "processed_at")
    private LocalDateTime processedAt;
    
    public void markAsProcessed(String openaiFileId) {
        this.openaiFileId = openaiFileId;
        this.status = "processed";
        this.processedAt = LocalDateTime.now();
    }
    
    public void markAsFailed(String error) {
        this.status = "failed";
        if (this.processingDetails != null) {
            this.processingDetails.put("error", error);
        }
    }
}