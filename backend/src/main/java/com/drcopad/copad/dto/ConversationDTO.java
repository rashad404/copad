package com.drcopad.copad.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConversationDTO {
    private String id;
    private String message;
    private boolean isUser;
    private LocalDateTime timestamp;

    public ConversationDTO(String message, String sender) {
        this.message = message;
        this.isUser = "USER".equals(sender);
        this.timestamp = LocalDateTime.now();
    }
}
