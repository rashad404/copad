package com.drcopad.copad.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResponsesAPIRequest {
    
    @JsonProperty("model")
    private String model;
    
    @JsonProperty("input")
    private String input;
    
    @JsonProperty("system_prompt")
    private String systemPrompt;
    
    @JsonProperty("previous_response_id")
    private String previousResponseId;
    
    @JsonProperty("conversation_id")
    private String conversationId;
    
    @JsonProperty("tools")
    private List<String> tools;
    
    @JsonProperty("file_ids")
    private List<String> fileIds;
    
    @JsonProperty("temperature")
    @Builder.Default
    private Double temperature = 0.7;
    
    @JsonProperty("max_tokens")
    @Builder.Default
    private Integer maxTokens = 2000;
    
    @JsonProperty("top_p")
    @Builder.Default
    private Double topP = 1.0;
    
    @JsonProperty("frequency_penalty")
    @Builder.Default
    private Double frequencyPenalty = 0.0;
    
    @JsonProperty("presence_penalty")
    @Builder.Default
    private Double presencePenalty = 0.0;
}