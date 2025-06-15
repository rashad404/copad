package com.drcopad.copad.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConversationStatsResponse {
    private String conversationId;
    private int messageCount;
    private long totalTokens;
    private double totalCost;
    private double averageResponseTimeMs;
}