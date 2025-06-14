package com.drcopad.copad.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatGPTResponse {
    private String id;
    private String object;
    private long created;
    private String model;
    private List<Choice> choices;
    private Usage usage;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Choice {
        private int index;
        private Message message;
        @com.fasterxml.jackson.annotation.JsonProperty("finish_reason")
        private String finishReason;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Usage {
        @com.fasterxml.jackson.annotation.JsonProperty("prompt_tokens")
        private int promptTokens;
        @com.fasterxml.jackson.annotation.JsonProperty("completion_tokens")
        private int completionTokens;
        @com.fasterxml.jackson.annotation.JsonProperty("total_tokens")
        private int totalTokens;
    }
}