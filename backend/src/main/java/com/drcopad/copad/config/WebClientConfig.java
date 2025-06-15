package com.drcopad.copad.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.ExchangeStrategies;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import reactor.netty.http.client.HttpClient;
import reactor.netty.resources.ConnectionProvider;

import java.time.Duration;

@Configuration
public class WebClientConfig implements WebMvcConfigurer {
    
    @Bean
    public WebClient webClient() {
        // Configure connection provider with proper pool settings
        ConnectionProvider connectionProvider = ConnectionProvider.builder("custom")
                .maxConnections(500)
                .maxIdleTime(Duration.ofSeconds(20))
                .maxLifeTime(Duration.ofSeconds(60))
                .pendingAcquireTimeout(Duration.ofSeconds(60))
                .evictInBackground(Duration.ofSeconds(120))
                .build();
        
        // Configure HTTP client with timeouts
        HttpClient httpClient = HttpClient.create(connectionProvider)
                .responseTimeout(Duration.ofSeconds(45))
                .option(io.netty.channel.ChannelOption.CONNECT_TIMEOUT_MILLIS, 10000);
        
        // Increase memory buffer to handle larger responses (images, etc)
        ExchangeStrategies strategies = ExchangeStrategies.builder()
                .codecs(configurer -> configurer.defaultCodecs().maxInMemorySize(16 * 1024 * 1024)) // 16MB
                .build();
                
        return WebClient.builder()
                .clientConnector(new ReactorClientHttpConnector(httpClient))
                .exchangeStrategies(strategies)
                .build();
    }
    
    // Resource handlers removed - files are now served directly from public_html
} 