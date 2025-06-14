package com.drcopad.copad.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class MessageContent {
    private String type;
    private String text;
    private ImageUrl image_url;
    
    @Data
    @NoArgsConstructor
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class ImageUrl {
        private String url;
        private String detail; // "auto", "low", or "high"
        
        public ImageUrl(String url, String detail) {
            this.url = url;
            this.detail = detail;
        }
    }
}