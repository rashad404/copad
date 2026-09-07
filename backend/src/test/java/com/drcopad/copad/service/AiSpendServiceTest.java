package com.drcopad.copad.service;

import com.drcopad.copad.config.OpenAIResponsesConfig;
import com.drcopad.copad.entity.responses.UsageMetric;
import com.drcopad.copad.repository.responses.UsageMetricRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * The ceiling on the bill.
 *
 * The behaviour that matters is not the arithmetic but what happens at the
 * edges: a ceiling that refuses when it should not costs every user their
 * answer, and one that fails open costs money without limit.
 */
class AiSpendServiceTest {

    private UsageMetricRepository usageMetrics;
    private com.drcopad.copad.repository.GuestSessionRepository guestSessions;
    private CostCalculationService costs;
    private AiSpendService spend;

    @BeforeEach
    void setUp() {
        usageMetrics = mock(UsageMetricRepository.class);
        guestSessions = mock(com.drcopad.copad.repository.GuestSessionRepository.class);
        when(guestSessions.findBySessionId(any())).thenReturn(java.util.Optional.empty());
        costs = mock(CostCalculationService.class);
        OpenAIResponsesConfig config = new OpenAIResponsesConfig();

        spend = new AiSpendService(usageMetrics, guestSessions, costs, config);
        ReflectionTestUtils.setField(spend, "dailyLimit", new BigDecimal("10.00"));
        ReflectionTestUtils.setField(spend, "enforce", true);
    }

    private void spentToday(String amount) {
        when(usageMetrics.getTotalCostSince(any())).thenReturn(new BigDecimal(amount));
    }

    @Test
    void allowsACallUnderTheLimit() {
        spentToday("9.99");
        assertDoesNotThrow(() -> spend.requireBudget());
    }

    @Test
    void refusesOnceTheLimitIsReached() {
        spentToday("10.00");
        assertThrows(AiSpendService.BudgetExhaustedException.class, () -> spend.requireBudget());
    }

    @Test
    void theRefusalSaysSomethingAPersonCanRead() {
        spentToday("25.00");
        var thrown = assertThrows(AiSpendService.BudgetExhaustedException.class,
                () -> spend.requireBudget());
        // It reaches the user, so it must not mention budgets or dollars.
        assertFalse(thrown.getMessage().toLowerCase().contains("usd"));
        assertTrue(thrown.getMessage().toLowerCase().contains("tomorrow"));
    }

    @Test
    void aBrokenMeterDoesNotRefuseEveryone() {
        // Failing closed here would take the product down over an accounting
        // problem, which is the worse of the two failures at this scale.
        when(usageMetrics.getTotalCostSince(any()))
                .thenThrow(new RuntimeException("database down"));
        assertDoesNotThrow(() -> spend.requireBudget());
    }

    @Test
    void enforcementCanBeTurnedOffToWatchTheMeter() {
        ReflectionTestUtils.setField(spend, "enforce", false);
        spentToday("1000.00");
        assertDoesNotThrow(() -> spend.requireBudget());
    }

    @Test
    void recordingFailureNeverLosesTheReply() {
        // The person already waited for the answer; an accounting failure must
        // not turn it into an error.
        when(costs.calculateUsageCost(any(), anyInt(), anyInt(), any()))
                .thenThrow(new RuntimeException("pricing missing"));
        assertDoesNotThrow(() -> spend.record("o3", 100, 100, "chat-1"));
    }

    @Test
    void aRecordedCallCountsTowardsTheCeiling() {
        spentToday("0.00");
        assertEquals(0, spend.spentToday().compareTo(BigDecimal.ZERO));

        UsageMetric metric = UsageMetric.builder()
                .model("o3").totalCost(new BigDecimal("4.00"))
                .createdAt(LocalDateTime.now()).build();
        when(costs.calculateUsageCost(any(), anyInt(), anyInt(), any())).thenReturn(metric);
        when(usageMetrics.save(any())).thenReturn(metric);

        spend.record("o3", 100, 100, "session-1");

        // Read from the running total, not by summing the table again.
        assertEquals(0, spend.spentToday().compareTo(new BigDecimal("4.00")));
        verify(usageMetrics, times(1)).getTotalCostSince(any());
    }
}
