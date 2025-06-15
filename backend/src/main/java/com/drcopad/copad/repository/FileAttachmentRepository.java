package com.drcopad.copad.repository;

import com.drcopad.copad.entity.ChatMessage;
import com.drcopad.copad.entity.FileAttachment;
import com.drcopad.copad.entity.GuestSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FileAttachmentRepository extends JpaRepository<FileAttachment, Long> {
    
    List<FileAttachment> findByMessage(ChatMessage message);
    
    List<FileAttachment> findByGuestSession(GuestSession session);
    
    Optional<FileAttachment> findByFileId(String fileId);
    
    List<FileAttachment> findAllByFileIdIn(List<String> fileIds);
    
    List<FileAttachment> findByBatchId(String batchId);
    
    void deleteByGuestSession(GuestSession session);
}