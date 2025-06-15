package com.drcopad.copad.dto;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data
public class BatchFileUploadRequest {
    private List<MultipartFile> files;
    private String category;
    private String conversationId;
    private List<String> tags;
    private String description;
}