package com.drcopad.copad.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FileAttachment {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String fileId;
    
    @Column(nullable = false)
    private String filePath;
    
    @Column(nullable = false)
    private String originalFilename;
    
    @Column(nullable = false)
    private String fileType;
    
    @Column(nullable = false)
    private Long fileSize;
    
    @Column
    private String extractedText;
    
    @Column(name = "openai_file_id")
    private String openaiFileId;
    
    @Column(name = "batch_id")
    private String batchId;
    
    @ManyToOne
    @JoinColumn(name = "message_id")
    private ChatMessage message;
    
    @ManyToOne
    @JoinColumn(name = "session_id")
    private GuestSession guestSession;
    
    @Column(nullable = false)
    private LocalDateTime uploadedAt;
    
    @PrePersist
    public void prePersist() {
        if (fileId == null) {
            fileId = UUID.randomUUID().toString();
        }
        if (uploadedAt == null) {
            uploadedAt = LocalDateTime.now();
        }
    }
}