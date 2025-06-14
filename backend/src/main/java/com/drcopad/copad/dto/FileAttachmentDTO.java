package com.drcopad.copad.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FileAttachmentDTO {
    
    private String fileId;
    private String url;
    private String filename;
    private String fileType;
    private Long fileSize;
    private LocalDateTime uploadedAt;
    
    // For image files
    private String thumbnailUrl;
    
    // Flag to indicate if this is an image
    private boolean isImage;
}