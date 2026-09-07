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
    private final AttachmentStorageService storage;
    
    public FileAttachment uploadFile(MultipartFile file, String sessionId, String fileType) throws IOException {
        // The session is resolved first: an upload that belongs to nobody could
        // never be served back, and would leave an unreachable file behind.
        GuestSession session = guestSessionRepository.findBySessionId(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid session ID"));

        AttachmentStorageService.Stored stored = storage.store(file);

        FileAttachment attachment = FileAttachment.builder()
                .fileId(UUID.randomUUID().toString())
                // Nothing is written to the web root any more; the legacy
                // column records the key so old and new rows read alike.
                .filePath(stored.storageKey())
                .storageKey(stored.storageKey())
                .originalFilename(file.getOriginalFilename())
                // The detected type, not the declared one.
                .fileType(stored.detectedType())
                .fileSize(stored.size())
                .guestSession(session)
                .build();

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
                attachmentUrl(attachment),
                attachment.getOriginalFilename(),
                attachment.getFileType(),
                attachment.getFileSize(),
                attachment.getUploadedAt(),
                null, // thumbnailUrl
                isImage
        );
    }

    /**
     * Where the client fetches the file.
     *
     * Relative, and carrying the session: the endpoint checks it, and an <img>
     * tag cannot send a header.
     */
    private String attachmentUrl(FileAttachment attachment) {
        String session = attachment.getGuestSession() == null
                ? null : attachment.getGuestSession().getSessionId();
        return "/api/attachments/" + attachment.getFileId()
                + (session == null ? "" : "?s=" + session);
    }
}