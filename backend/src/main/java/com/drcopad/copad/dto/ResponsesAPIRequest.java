package com.drcopad.copad.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResponsesAPIRequest {
    
    @JsonProperty("model")
    private String model;
    
    @JsonProperty("input")
    private String input;
    
    @JsonProperty("instructions")
    private String systemPrompt;
    
    @JsonProperty("previous_response_id")
    private String previousResponseId;
    
    // conversation_id is not part of the API - removed
    // private String conversationId;
    
    @JsonProperty("tools")
    private List<Map<String, Object>> tools;  // Changed to match API structure
    
    // file_ids are passed within tools - removed
    // private List<String> fileIds;
    
    @JsonProperty("temperature")
    @Builder.Default
    private Double temperature = 0.7;
    
    @JsonProperty("max_output_tokens")
    @Builder.Default
    private Integer maxTokens = 2000;
    
    @JsonProperty("top_p")
    @Builder.Default
    private Double topP = 1.0;
    
    // Removed frequency_penalty and presence_penalty - not supported by Responses API
    
    @JsonProperty("tool_choice")
    private Object toolChoice;  // Can be "auto", "none", or specific tool
    
    @JsonProperty("parallel_tool_calls")
    private Boolean parallelToolCalls;
    
    @JsonProperty("background")
    private Boolean background;  // For long-running tasks
}