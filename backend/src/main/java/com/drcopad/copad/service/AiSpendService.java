package com.drcopad.copad.service;

import com.drcopad.copad.config.OpenAIResponsesConfig;
import com.drcopad.copad.entity.responses.UsageMetric;
import com.drcopad.copad.repository.responses.UsageMetricRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.atomic.AtomicReference;

/**
 * What the assistant has cost today, and the point at which it stops.
 *
 * Two problems this exists to fix.
 *
 * The main chat path recorded nothing. Cost accounting lived only on the
 * Responses API, which /api/guest/chat does not use, so 612 messages in
 * production produced 122 usage rows and recent calls recorded a cost of zero.
 * A bill cannot be capped before it can be measured.
 *
 * And the limits that did exist were per user and per session. Neither can
 * bound the total: a session costs nothing to mint, so a thousand fresh ones
 * each stay comfortably under their own limit while the platform's bill runs
 * away. The ceiling here is platform-wide for the same reason the rate limiter
 * counts by IP as well as by session.
 */
@Slf4j
@Service
public class AiSpendService {

    private final UsageMetricRepository usageMetrics;
    private final com.drcopad.copad.repository.GuestSessionRepository guestSessions;
    private final CostCalculationService costs;
    private final OpenAIResponsesConfig responsesConfig;

    /**
     * The ceiling, in USD per day.
     *
     * Separate from the per-user limit in the Responses config, which is a
     * different question: that one is about one person's fair share, this one
     * is about the bill.
     */
    @Value("${ai.spend.daily-limit-usd:25.00}")
    private BigDecimal dailyLimit;

    /** Set false to observe the meter without ever refusing a request. */
    @Value("${ai.spend.enforce:true}")
    private boolean enforce;

    /**
     * Today's total, so the common path does not sum the table on every call.
     *
     * Held with the day it belongs to, so it expires at midnight without a
     * scheduler. Refreshed from the database when the day rolls over or after a
     * write, which keeps a restart or a second instance from starting at zero.
     */
    private final AtomicReference<Snapshot> snapshot =
            new AtomicReference<>(new Snapshot(LocalDate.MIN, BigDecimal.ZERO));

    private record Snapshot(LocalDate day, BigDecimal spent) {
    }

    public AiSpendService(UsageMetricRepository usageMetrics,
                          com.drcopad.copad.repository.GuestSessionRepository guestSessions,
                          CostCalculationService costs,
                          @Qualifier("openAIResponsesConfig") OpenAIResponsesConfig responsesConfig) {
        this.usageMetrics = usageMetrics;
        this.guestSessions = guestSessions;
        this.costs = costs;
        this.responsesConfig = responsesConfig;
    }

    /** Thrown when the day's budget is gone. */
    public static class BudgetExhaustedException extends RuntimeException {
        public BudgetExhaustedException(String message) {
            super(message);
        }
    }

    /**
     * Refuses the call when today's budget is spent.
     *
     * Checked before the request rather than after, because the point is not to
     * find out what was spent.
     */
    public void requireBudget() {
        if (!enforce) return;

        BigDecimal spent = spentToday();
        if (spent.compareTo(dailyLimit) >= 0) {
            log.error("Daily AI budget exhausted: {} of {} USD", spent, dailyLimit);
            throw new BudgetExhaustedException(
                    "The assistant has reached its limit for today. Please try again tomorrow.");
        }
    }

    public BigDecimal spentToday() {
        LocalDate today = LocalDate.now();
        Snapshot current = snapshot.get();
        if (current.day().equals(today)) return current.spent();
        return refresh(today);
    }

    public BigDecimal dailyLimit() {
        return dailyLimit;
    }

    /**
     * Records what a chat turn cost.
     *
     * In its own transaction, and never allowed to throw: an accounting failure
     * must not lose a reply the person already waited for. The consequence of
     * losing a row is an undercount, which the periodic refresh corrects.
     */
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void record(String model, int promptTokens, int completionTokens, String sessionId) {
        try {
            UsageMetric metric = costs.calculateUsageCost(
                    model, promptTokens, completionTokens, List.of());
            metric.setApiType("chat");
            // Never the chat id: conversation_id carries a foreign key to the
            // Responses API's conversations table, and a guest chat id is not a
            // row in it. That constraint exists on production and not locally,
            // so every chat-path usage row was rejected in production while the
            // same code recorded happily on a developer machine.
            if (sessionId != null) {
                guestSessions.findBySessionId(sessionId).ifPresent(metric::setGuestSession);
            }
            metric.setCreatedAt(LocalDateTime.now());
            usageMetrics.save(metric);

            LocalDate today = LocalDate.now();
            snapshot.updateAndGet(current -> current.day().equals(today)
                    ? new Snapshot(today, current.spent().add(metric.getTotalCost()))
                    : new Snapshot(today, metric.getTotalCost()));

            BigDecimal spent = snapshot.get().spent();
            if (spent.compareTo(responsesConfig.getCost().getAlertThreshold()) >= 0
                    && spent.subtract(metric.getTotalCost())
                            .compareTo(responsesConfig.getCost().getAlertThreshold()) < 0) {
                log.warn("AI spend passed the alert threshold: {} USD today", spent);
            }
        } catch (Exception e) {
            log.warn("Could not record AI usage: {}", e.getClass().getSimpleName());
        }
    }

    private BigDecimal refresh(LocalDate today) {
        BigDecimal spent;
        try {
            spent = usageMetrics.getTotalCostSince(today.atStartOfDay());
            if (spent == null) spent = BigDecimal.ZERO;
        } catch (Exception e) {
            // A failure to read the meter must not become a refusal to answer.
            log.warn("Could not read today's AI spend: {}", e.getClass().getSimpleName());
            return BigDecimal.ZERO;
        }
        snapshot.set(new Snapshot(today, spent));
        return spent;
    }
}
