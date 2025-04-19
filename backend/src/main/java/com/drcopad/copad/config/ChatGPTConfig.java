package com.drcopad.copad.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.StringUtils;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Data
@Configuration
@ConfigurationProperties(prefix = "app.chatgpt")
public class ChatGPTConfig {
    private static final Logger log = LoggerFactory.getLogger(ChatGPTConfig.class);
    private boolean useDummyData = false;
    private OpenAIConfig openai = new OpenAIConfig();

    @Data
    public static class OpenAIConfig {
        private String key;
        private String model;
        private String url;
    }

    @PostConstruct
    public void validate() {
        // log.info("ChatGPT Configuration: useDummyData={}, openai={}", useDummyData, openai);
        
        if (openai == null) {
            openai = new OpenAIConfig();
        }

        if (!useDummyData) {
            if (!StringUtils.hasText(openai.getKey())) {
                throw new IllegalStateException("OpenAI API key is not set. Please set the OPENAI_API_KEY environment variable.");
            }
        }
        
        if (!StringUtils.hasText(openai.getModel())) {
            throw new IllegalStateException("ChatGPT model is not configured.");
        }
        if (!StringUtils.hasText(openai.getUrl())) {
            throw new IllegalStateException("ChatGPT API URL is not configured.");
        }
    }
} 