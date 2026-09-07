package com.drcopad.copad.controller;

import com.drcopad.copad.repository.responses.UsageMetricRepository;
import com.drcopad.copad.service.AiSpendService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * What the assistant has cost.
 *
 * The daily figure is operational, not a vanity metric: when spend reaches the
 * ceiling the assistant stops answering, so this is where someone finds out why
 * before a user reports it.
 *
 * Under /api/admin, which is the only prefix the security config gates on
 * ADMIN. Usage is not patient data, but it describes how the product is being
 * used and does not belong to any user.
 */
@Slf4j
@RestController
@RequestMapping("/api/admin/usage")
@RequiredArgsConstructor
public class AdminUsageController {

    private final UsageMetricRepository usageMetrics;
    private final AiSpendService spend;

    @GetMapping
    public Map<String, Object> usage(@RequestParam(defaultValue = "30") int days) {
        // A year is plenty; an unbounded window would scan the whole table.
        int window = Math.min(Math.max(days, 1), 365);
        var since = LocalDate.now().minusDays(window - 1L).atStartOfDay();

        var totalsRows = usageMetrics.getTotalsSince(since);
        Object[] totals = totalsRows.isEmpty() ? new Object[0] : totalsRows.get(0);

        Map<String, Object> out = new LinkedHashMap<>();
        out.put("days", window);
        out.put("dailyLimitUsd", money(spend.dailyLimit()));
        out.put("spentTodayUsd", money(spend.spentToday()));
        out.put("totals", Map.of(
                "calls", asLong(totals, 0),
                "tokens", asLong(totals, 1),
                "costUsd", money(asDecimal(totals, 2))));

        out.put("daily", usageMetrics.getDailyUsage(since).stream()
                .map(r -> Map.of(
                        "date", String.valueOf(r[0]),
                        "calls", asLong(r, 1),
                        "tokens", asLong(r, 2),
                        "costUsd", money(asDecimal(r, 3))))
                .toList());

        out.put("byModel", usageMetrics.getUsageByModel(since).stream()
                .map(r -> Map.of(
                        "model", r[0] == null ? "unknown" : String.valueOf(r[0]),
                        "calls", asLong(r, 1),
                        "tokens", asLong(r, 2),
                        "costUsd", money(asDecimal(r, 3))))
                .toList());

        return out;
    }

    private long asLong(Object[] row, int index) {
        if (row == null || row.length <= index || row[index] == null) return 0L;
        return ((Number) row[index]).longValue();
    }

    private BigDecimal asDecimal(Object[] row, int index) {
        if (row == null || row.length <= index || row[index] == null) return BigDecimal.ZERO;
        Object value = row[index];
        return value instanceof BigDecimal d ? d : BigDecimal.valueOf(((Number) value).doubleValue());
    }

    /**
     * Two decimals for money, four for a total small enough that two would read
     * as zero - a single call costs a fraction of a cent, and rounding that
     * away would make a working meter look broken.
     */
    private BigDecimal money(BigDecimal value) {
        if (value == null) return BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);
        BigDecimal rounded = value.setScale(2, RoundingMode.HALF_UP);
        if (rounded.signum() == 0 && value.signum() != 0) {
            return value.setScale(4, RoundingMode.HALF_UP);
        }
        return rounded;
    }
}
