package com.drcopad.copad.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
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
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Message {
    private String role;
    
    // For deserialization from OpenAI response
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String content;
    
    // For sending multimodal content to OpenAI
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private List<MessageContent> content_objects;
    
    public Message(String role, String content) {
        this.role = role;
        this.content = content;
    }
    
    /**
     * This is used for serialization to OpenAI API.
     * It returns either a String or List<MessageContent> depending on which one is available.
     */
    @JsonProperty(value = "content", access = JsonProperty.Access.READ_ONLY)
    public Object getContentForJson() {
        if (content_objects != null && !content_objects.isEmpty()) {
            return content_objects;
        }
        return content;
    }
    
    /**
     * Getter for content - used by the ChatGPTService to read responses
     */
    public String getContent() {
        return this.content;
    }
} 