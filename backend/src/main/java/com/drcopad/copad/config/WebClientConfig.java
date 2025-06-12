package com.drcopad.copad.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.ExchangeStrategies;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebClientConfig implements WebMvcConfigurer {
    
    @Bean
    public WebClient webClient() {
        // Increase memory buffer to handle larger responses (images, etc)
        ExchangeStrategies strategies = ExchangeStrategies.builder()
                .codecs(configurer -> configurer.defaultCodecs().maxInMemorySize(16 * 1024 * 1024)) // 16MB
                .build();
                
        return WebClient.builder()
                .exchangeStrategies(strategies)
                .build();
    }
    
    // Configure resource handlers to serve uploaded files
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Register resource handler for images
        registry.addResourceHandler("/uploads/images/**")
                .addResourceLocations("file:uploads/images/");
                
        // Register resource handler for documents
        registry.addResourceHandler("/uploads/documents/**")
                .addResourceLocations("file:uploads/documents/");
    }
} 