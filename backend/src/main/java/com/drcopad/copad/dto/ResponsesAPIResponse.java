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
public class ResponsesAPIResponse {
    
    @JsonProperty("id")
    private String id;
    
    @JsonProperty("status")
    private String status;  // "completed", "in_progress", "failed"
    
    @JsonProperty("output")
    private List<Output> output;
    
    @JsonProperty("output_text")
    private String outputText;  // Convenience property for text output
    
    @JsonProperty("usage")
    private Usage usage;
    
    @JsonProperty("model")
    private String model;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Output {
        @JsonProperty("type")
        private String type;  // "text", "function_call", "tool_use"
        
        @JsonProperty("text")
        private String text;
        
        @JsonProperty("function")
        private FunctionCall function;
        
        @JsonProperty("id")
        private String id;  // For function calls
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FunctionCall {
        @JsonProperty("name")
        private String name;
        
        @JsonProperty("arguments")
        private Map<String, Object> arguments;
    }
    
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
}