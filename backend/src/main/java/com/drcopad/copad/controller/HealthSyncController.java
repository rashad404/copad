package com.drcopad.copad.controller;

import com.drcopad.copad.entity.HealthProvider;
import com.drcopad.copad.entity.User;
import com.drcopad.copad.entity.VitalType;
import com.drcopad.copad.service.HealthSyncService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Readings arriving from a phone, a watch or an exported file.
 *
 * Under the family member, like every other clinical thing here: a parent
 * syncing their own watch must not have those readings land in a child's
 * record.
 */
@RestController
@RequestMapping("/api/members/{memberId}/health-sync")
@RequiredArgsConstructor
public class HealthSyncController {

    private final HealthSyncService sync;

    @Data
    public static class ConnectRequest {
        private HealthProvider provider;
        private String deviceLabel;
    }

    @Data
    public static class SampleRequest {
        private VitalType type;
        private BigDecimal value;
        private String unit;
        private LocalDateTime measuredAt;
        /** The device's own id for this sample. Without it nothing is taken. */
        private String sourceRef;
        private String deviceLabel;
    }

    @Data
    public static class SyncRequest {
        private HealthProvider provider;
        private List<SampleRequest> samples;
    }

    @GetMapping
    public List<Map<String, Object>> connections(@PathVariable Long memberId,
                                                 @AuthenticationPrincipal User user) {
        return sync.connections(memberId, user.getId()).stream().map(c -> {
            Map<String, Object> row = new LinkedHashMap<>();
            row.put("id", c.getId());
            row.put("provider", c.getProvider());
            row.put("deviceLabel", c.getDeviceLabel());
            row.put("enabled", c.isEnabled());
            row.put("syncedThrough", c.getSyncedThrough());
            row.put("lastSyncAt", c.getLastSyncAt());
            return row;
        }).toList();
    }

    @PostMapping("/connect")
    public Map<String, Object> connect(@PathVariable Long memberId,
                                       @RequestBody ConnectRequest body,
                                       @AuthenticationPrincipal User user) {
        var connection = sync.connect(memberId, user.getId(),
                body.getProvider(), body.getDeviceLabel());
        return Map.of("id", connection.getId(),
                "provider", connection.getProvider(),
                "enabled", connection.isEnabled());
    }

    @PostMapping("/disconnect")
    public ResponseEntity<Void> disconnect(@PathVariable Long memberId,
                                           @RequestBody ConnectRequest body,
                                           @AuthenticationPrincipal User user) {
        sync.disconnect(memberId, user.getId(), body.getProvider());
        return ResponseEntity.noContent().build();
    }

    /**
     * Takes a batch.
     *
     * The counts come back rather than a bare success: a sync that quietly drops
     * half of what was sent is worse than one that says so, and the client needs
     * to know where to resume.
     */
    @PostMapping
    public Map<String, Object> sync(@PathVariable Long memberId,
                                    @RequestBody SyncRequest body,
                                    @AuthenticationPrincipal User user) {
        List<HealthSyncService.Sample> samples = body.getSamples() == null
                ? List.of()
                : body.getSamples().stream()
                        .map(s -> new HealthSyncService.Sample(s.getType(), s.getValue(),
                                s.getUnit(), s.getMeasuredAt(), s.getSourceRef(),
                                s.getDeviceLabel()))
                        .toList();

        HealthSyncService.Result result =
                sync.sync(memberId, user.getId(), body.getProvider(), samples);

        Map<String, Object> row = new LinkedHashMap<>();
        row.put("accepted", result.accepted());
        row.put("alreadyHad", result.alreadyHad());
        row.put("skippedManual", result.skippedManual());
        row.put("rejected", result.rejected());
        row.put("syncedThrough", result.syncedThrough());
        row.put("maxBatch", HealthSyncService.MAX_BATCH);
        return row;
    }
}
