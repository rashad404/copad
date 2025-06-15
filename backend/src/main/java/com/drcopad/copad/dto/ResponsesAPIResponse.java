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
public class ResponsesAPIResponse {
    
    @JsonProperty("response_id")
    private String responseId;
    
    @JsonProperty("conversation_id")
    private String conversationId;
    
    @JsonProperty("content")
    private String content;
    
    @JsonProperty("model")
    private String model;
    
    @JsonProperty("created")
    private Long created;
    
    @JsonProperty("usage")
    private Usage usage;
    
    @JsonProperty("tools_used")
    private List<String> toolsUsed;
    
    @JsonProperty("citations")
    private List<Citation> citations;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Usage {
        @JsonProperty("prompt_tokens")
        private Integer promptTokens;
        
        @JsonProperty("completion_tokens")
        private Integer completionTokens;
        
        @JsonProperty("total_tokens")
        private Integer totalTokens;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Citation {
        @JsonProperty("file_id")
        private String fileId;
        
        @JsonProperty("quote")
        private String quote;
        
        @JsonProperty("page")
        private Integer page;
        
        @JsonProperty("start_index")
        private Integer startIndex;
        
        @JsonProperty("end_index")
        private Integer endIndex;
    }
}