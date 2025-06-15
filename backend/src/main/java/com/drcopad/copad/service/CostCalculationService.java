package com.drcopad.copad.service;

import com.drcopad.copad.config.OpenAIResponsesConfig;
import com.drcopad.copad.entity.responses.UsageMetric;
import com.drcopad.copad.repository.responses.UsageMetricRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
public class CostCalculationService {
    
    private final OpenAIResponsesConfig responsesConfig;
    private final UsageMetricRepository usageMetricRepository;
    
    public CostCalculationService(@Qualifier("openAIResponsesConfig") OpenAIResponsesConfig responsesConfig,
                                 UsageMetricRepository usageMetricRepository) {
        this.responsesConfig = responsesConfig;
        this.usageMetricRepository = usageMetricRepository;
    }
    
    /**
     * Calculate cost for a specific API call
     */
    public UsageMetric calculateUsageCost(String model, int inputTokens, int outputTokens, 
                                         List<String> toolsUsed) {
        OpenAIResponsesConfig.ModelPricing pricing = responsesConfig.getCost()
                .getModelPricing().get(model);
        
        if (pricing == null) {
            log.warn("No pricing found for model: {}, using default gpt-4o-mini pricing", model);
            pricing = responsesConfig.getCost().getModelPricing().get("gpt-4o-mini");
        }
        
        // Calculate token costs (per 1K tokens)
        BigDecimal inputCost = pricing.getInputCostPer1k()
                .multiply(BigDecimal.valueOf(inputTokens))
                .divide(BigDecimal.valueOf(1000), 6, RoundingMode.HALF_UP);
        
        BigDecimal outputCost = pricing.getOutputCostPer1k()
                .multiply(BigDecimal.valueOf(outputTokens))
                .divide(BigDecimal.valueOf(1000), 6, RoundingMode.HALF_UP);
        
        // Calculate tool costs
        BigDecimal toolsCost = calculateToolsCost(toolsUsed);
        
        BigDecimal totalCost = inputCost.add(outputCost).add(toolsCost);
        
        return UsageMetric.builder()
                .model(model)
                .inputTokens(inputTokens)
                .outputTokens(outputTokens)
                .totalTokens(inputTokens + outputTokens)
                .inputCost(inputCost)
                .outputCost(outputCost)
                .toolsCost(toolsCost)
                .totalCost(totalCost)
                .toolsUsed(toolsUsed)
                .apiType("responses")
                .build();
    }
    
    /**
     * Calculate costs for tools used
     */
    private BigDecimal calculateToolsCost(List<String> toolsUsed) {
        if (toolsUsed == null || toolsUsed.isEmpty()) {
            return BigDecimal.ZERO;
        }
        
        BigDecimal totalToolsCost = BigDecimal.ZERO;
        OpenAIResponsesConfig.CostConfig costConfig = responsesConfig.getCost();
        
        for (String tool : toolsUsed) {
            switch (tool.toLowerCase()) {
                case "file_search":
                    totalToolsCost = totalToolsCost.add(costConfig.getFileSearchCostPerQuery());
                    break;
                case "web_search":
                case "web_search_preview":
                case "web_search_preview_2025_03_11":
                    totalToolsCost = totalToolsCost.add(costConfig.getWebSearchCostPerQuery());
                    break;
                case "code_interpreter":
                    totalToolsCost = totalToolsCost.add(costConfig.getCodeInterpreterCostPerSession());
                    break;
                default:
                    log.debug("Unknown tool for cost calculation: {}", tool);
            }
        }
        
        return totalToolsCost;
    }
    
    /**
     * Check if user has exceeded daily cost limit
     */
    public boolean hasExceededDailyLimit(Long userId) {
        LocalDateTime startOfDay = LocalDateTime.now().toLocalDate().atStartOfDay();
        BigDecimal dailyTotal = usageMetricRepository.getTotalCostForUser(userId, startOfDay);
        
        if (dailyTotal == null) {
            return false;
        }
        
        return dailyTotal.compareTo(responsesConfig.getCost().getDailyLimit()) > 0;
    }
    
    /**
     * Check if guest has exceeded daily limit
     */
    public boolean hasGuestExceededDailyLimit(Long guestSessionId) {
        LocalDateTime startOfDay = LocalDateTime.now().toLocalDate().atStartOfDay();
        Long totalTokens = usageMetricRepository.getTotalTokensForGuest(guestSessionId, startOfDay);
        
        // For guests, use a token-based limit (e.g., 100K tokens per day)
        return totalTokens != null && totalTokens > 100000;
    }
    
    /**
     * Get user's daily usage summary
     */
    public DailyUsageSummary getUserDailyUsage(Long userId) {
        LocalDateTime startOfDay = LocalDateTime.now().toLocalDate().atStartOfDay();
        List<UsageMetric> todayMetrics = usageMetricRepository
                .findByUser_IdAndCreatedAtBetween(userId, startOfDay, LocalDateTime.now());
        
        long totalTokens = todayMetrics.stream()
                .mapToLong(m -> m.getTotalTokens() != null ? m.getTotalTokens() : 0)
                .sum();
        
        BigDecimal totalCost = todayMetrics.stream()
                .map(m -> m.getTotalCost() != null ? m.getTotalCost() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        BigDecimal remainingBudget = responsesConfig.getCost().getDailyLimit().subtract(totalCost);
        
        return DailyUsageSummary.builder()
                .userId(userId)
                .date(LocalDateTime.now().toLocalDate())
                .totalTokens(totalTokens)
                .totalCost(totalCost)
                .remainingBudget(remainingBudget.max(BigDecimal.ZERO))
                .callCount(todayMetrics.size())
                .limitExceeded(remainingBudget.compareTo(BigDecimal.ZERO) < 0)
                .build();
    }
    
    /**
     * Check if cost alert threshold is reached
     */
    public boolean shouldAlertCostThreshold(BigDecimal currentCost) {
        return currentCost.compareTo(responsesConfig.getCost().getAlertThreshold()) >= 0;
    }
    
    @lombok.Builder
    @lombok.Data
    public static class DailyUsageSummary {
        private Long userId;
        private java.time.LocalDate date;
        private long totalTokens;
        private BigDecimal totalCost;
        private BigDecimal remainingBudget;
        private int callCount;
        private boolean limitExceeded;
    }
}