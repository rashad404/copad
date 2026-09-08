package com.drcopad.copad.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@Profile("test")
public class TestConfig {
    
    // No webClient bean here on purpose. WebClientConfig already defines one
    // under that name, and Spring Boot refuses the duplicate rather than
    // silently picking a winner - which is why every test in this context
    // failed to start. The real client builds without touching the network, so
    // there was nothing to replace.

    @Bean
    public ObjectMapper objectMapper() {
        return new ObjectMapper();
    }

    @Bean
    public PasswordEncoder testPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public ChatGPTConfig chatGPTConfig() {
        ChatGPTConfig config = new ChatGPTConfig();
        config.setUseDummyData(true);
        ChatGPTConfig.OpenAIConfig openaiConfig = new ChatGPTConfig.OpenAIConfig();
        openaiConfig.setKey("dummy-key");
        openaiConfig.setModel("gpt-3.5-turbo");
        openaiConfig.setUrl("https://api.openai.com/v1/chat/completions");
        config.setOpenai(openaiConfig);
        return config;
    }
} 