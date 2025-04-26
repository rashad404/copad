package com.drcopad.copad.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
@Profile("test")
public class TestConfig {
    
    @Bean
    public WebClient webClient() {
        return WebClient.builder().build();
    }

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