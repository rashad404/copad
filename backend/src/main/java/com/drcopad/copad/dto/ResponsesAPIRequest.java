package com.drcopad.copad.dto;

import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResponsesAPIRequest {

    @JsonProperty("model")
    private String model;

    @JsonProperty("input")
    private Object input;  // Can be String or List<Map> for multimodal

    @JsonProperty("instructions") // ✅ This is required by OpenAI Responses API
    private String instructions;

    @JsonProperty("previous_response_id")
    private String previousResponseId;

    @JsonProperty("tools")
    private List<Map<String, Object>> tools;

    @JsonProperty("temperature")
    @Builder.Default
    private Double temperature = 0.7;

    @JsonProperty("max_output_tokens")
    @Builder.Default
    private Integer maxOutputTokens = 2000;

    @JsonProperty("top_p")
    @Builder.Default
    private Double topP = 1.0;

    @JsonProperty("tool_choice")
    private Object toolChoice;

    @JsonProperty("parallel_tool_calls")
    private Boolean parallelToolCalls;

    @JsonProperty("background")
    private Boolean background;

    @JsonProperty("user")
    private String user;

    @JsonProperty("store")
    private Boolean store;
}
