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
public class MessageDTO {
    private String message;
    private String sender;
    private LocalDateTime timestamp;
    private String chatId;
    private String title;

    public MessageDTO(String message, String sender, LocalDateTime timestamp) {
        this.message = message;
        this.sender = sender;
        this.timestamp = timestamp;
    }

    public MessageDTO(String message, String sender) {
        this(message, sender, LocalDateTime.now());
    }
}
