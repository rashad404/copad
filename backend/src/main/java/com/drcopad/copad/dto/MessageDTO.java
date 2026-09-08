package com.drcopad.copad.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MessageDTO {
    /** The row this message is stored in, so an answer can be reported. */
    private Long id;
    private String message;
    private String sender;
    private LocalDateTime timestamp;
    private String chatId;
    private String title;
    
    @Builder.Default
    private List<FileAttachmentDTO> attachments = new ArrayList<>();

    public MessageDTO(Long id, String message, String sender, LocalDateTime timestamp) {
        this.id = id;
        this.message = message;
        this.sender = sender;
        this.timestamp = timestamp;
        this.attachments = new ArrayList<>();
    }

    public MessageDTO(String message, String sender) {
        this(null, message, sender, LocalDateTime.now());
    }
}
