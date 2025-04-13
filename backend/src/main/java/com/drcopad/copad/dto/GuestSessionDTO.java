package com.drcopad.copad.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GuestSessionDTO {
    private String sessionId;
    private LocalDateTime createdAt;
    private LocalDateTime lastActive;
    private List<ConversationDTO> conversations;
    private String email;
} 