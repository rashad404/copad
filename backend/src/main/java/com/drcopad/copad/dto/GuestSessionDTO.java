package com.drcopad.copad.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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
    private Map<String, List<ConversationDTO>> chats;

    public Map<String, List<ConversationDTO>> getChats() {
        if (conversations == null) {
            return Map.of();
        }
        return conversations.stream()
                .collect(Collectors.groupingBy(ConversationDTO::getChatId));
    }
} 