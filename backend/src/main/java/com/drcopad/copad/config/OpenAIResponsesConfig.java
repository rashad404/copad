package com.drcopad.copad.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Map;

@Data
@Component
@ConfigurationProperties(prefix = "app.chatgpt.openai.responses")
public class OpenAIResponsesConfig {
    
    private boolean enabled = false;
    private String url = "https://api.openai.com/v1/responses";
    private boolean fallbackToChat = true;
    private String defaultModel = "o3";
    private int conversationTtlDays = 30;
    
    private ToolsConfig tools = new ToolsConfig();
    private CostConfig cost = new CostConfig();
    private RetryConfig retry = new RetryConfig();
    
    @Data
    public static class ToolsConfig {
        private boolean fileSearch = true;
        private boolean webSearch = false;
        private boolean codeInterpreter = true;
    }
    
    @Data
    public static class CostConfig {
        private BigDecimal alertThreshold = new BigDecimal("10.00");
        private BigDecimal dailyLimit = new BigDecimal("50.00");
        
        // Pricing per 1K tokens (as of 2024)
        private Map<String, ModelPricing> modelPricing = Map.of(
            "o3", new ModelPricing(new BigDecimal("0.015"), new BigDecimal("0.060")),
            "gpt-4o", new ModelPricing(new BigDecimal("0.015"), new BigDecimal("0.060")),
            "gpt-4o-mini", new ModelPricing(new BigDecimal("0.00015"), new BigDecimal("0.0006")),
            "gpt-4-turbo", new ModelPricing(new BigDecimal("0.01"), new BigDecimal("0.03")),
            "gpt-3.5-turbo", new ModelPricing(new BigDecimal("0.0005"), new BigDecimal("0.0015"))
        );
        
        // Tool costs
        private BigDecimal fileSearchCostPerQuery = new BigDecimal("0.10");
        private BigDecimal webSearchCostPerQuery = new BigDecimal("0.30");
        private BigDecimal codeInterpreterCostPerSession = new BigDecimal("0.03");
    }
    
    @Data
    public static class RetryConfig {
        private int maxAttempts = 3;
        private long initialInterval = 1000;
        private long maxInterval = 10000;
        private double multiplier = 2.0;
    }
    
    @Data
    public static class ModelPricing {
        private final BigDecimal inputCostPer1k;
        private final BigDecimal outputCostPer1k;
        
        public ModelPricing(BigDecimal inputCostPer1k, BigDecimal outputCostPer1k) {
            this.inputCostPer1k = inputCostPer1k;
            this.outputCostPer1k = outputCostPer1k;
        }
    }
}