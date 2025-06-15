package com.drcopad.copad.repository.responses;

import com.drcopad.copad.entity.responses.ConversationFile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConversationFileRepository extends JpaRepository<ConversationFile, Long> {
    
    List<ConversationFile> findByConversationId(String conversationId);
    
    List<ConversationFile> findByConversationIdAndStatus(String conversationId, String status);
    
    List<ConversationFile> findByConversationIdAndCategory(String conversationId, String category);
    
    Optional<ConversationFile> findByOpenaiFileId(String openaiFileId);
    
    @Query("SELECT cf FROM ConversationFile cf WHERE cf.fileAttachment.id = :fileAttachmentId")
    Optional<ConversationFile> findByFileAttachmentId(@Param("fileAttachmentId") Long fileAttachmentId);
    
    @Query("SELECT COUNT(cf) FROM ConversationFile cf WHERE cf.conversationId = :conversationId AND cf.status = :status")
    long countByConversationIdAndStatus(@Param("conversationId") String conversationId, @Param("status") String status);
    
    List<ConversationFile> findByStatus(String status);
}