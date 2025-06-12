package com.drcopad.copad.service;

import com.drcopad.copad.dto.FileAttachmentDTO;
import com.drcopad.copad.entity.ChatMessage;
import com.drcopad.copad.entity.FileAttachment;
import com.drcopad.copad.entity.GuestSession;
import com.drcopad.copad.repository.FileAttachmentRepository;
import com.drcopad.copad.repository.GuestSessionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class FileAttachmentService {

    private final FileAttachmentRepository fileAttachmentRepository;
    private final GuestSessionRepository guestSessionRepository;
    
    private static final String IMAGE_DIR = "uploads/images";
    private static final String DOCUMENTS_DIR = "uploads/documents";
    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    
    public FileAttachment uploadFile(MultipartFile file, String sessionId, String fileType) throws IOException {
        // Validate file size
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException("File size exceeds the maximum limit of 10MB");
        }
        
        // Find the guest session
        GuestSession session = guestSessionRepository.findBySessionId(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid session ID"));
        
        // Determine upload directory based on file type
        String uploadDir = fileType.startsWith("image/") ? IMAGE_DIR : DOCUMENTS_DIR;
        Path uploadPath = Paths.get(uploadDir);
        
        // Create directory if it doesn't exist
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        
        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        String uniqueFilename = UUID.randomUUID().toString() + extension;
        
        // Save the file
        Path filePath = uploadPath.resolve(uniqueFilename);
        Files.copy(file.getInputStream(), filePath);
        
        // Create file attachment entity
        FileAttachment attachment = FileAttachment.builder()
                .fileId(UUID.randomUUID().toString())
                .filePath(uploadDir + "/" + uniqueFilename)
                .originalFilename(originalFilename)
                .fileType(file.getContentType())
                .fileSize(file.getSize())
                .guestSession(session)
                .build();
        
        // Save attachment to database and return entity
        return fileAttachmentRepository.save(attachment);
    }
    
    @Transactional
    public List<FileAttachmentDTO> getAttachmentsForMessage(ChatMessage message) {
        List<FileAttachment> attachments = fileAttachmentRepository.findByMessage(message);
        return attachments.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public List<FileAttachment> linkFilesToMessage(List<String> fileIds, ChatMessage message) {
        if (fileIds == null || fileIds.isEmpty()) {
            return new ArrayList<>();
        }
        
        List<FileAttachment> attachments = new ArrayList<>();
        
        for (String fileId : fileIds) {
            Optional<FileAttachment> attachmentOpt = fileAttachmentRepository.findByFileId(fileId);
            if (attachmentOpt.isPresent()) {
                FileAttachment attachment = attachmentOpt.get();
                attachment.setMessage(message);
                attachments.add(fileAttachmentRepository.save(attachment));
            } else {
                log.warn("File attachment with ID {} not found", fileId);
            }
        }
        
        return attachments;
    }
    
    private FileAttachmentDTO mapToDTO(FileAttachment attachment) {
        boolean isImage = attachment.getFileType().startsWith("image/");
        
        return new FileAttachmentDTO(
                attachment.getFileId(),
                "/" + attachment.getFilePath(),
                attachment.getOriginalFilename(),
                attachment.getFileType(),
                attachment.getFileSize(),
                attachment.getUploadedAt(),
                null, // thumbnailUrl
                isImage
        );
    }
}