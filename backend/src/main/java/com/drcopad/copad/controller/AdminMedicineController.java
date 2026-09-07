package com.drcopad.copad.controller;

import com.drcopad.copad.service.MedicineSyncService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Manual trigger for the drug catalogue sync.
 *
 * The scheduled monthly run is the normal path; this exists for the first
 * import and for re-running after a source update, without waiting a month.
 */
@Slf4j
@RestController
@RequestMapping("/api/admin/medicines")
@RequiredArgsConstructor
public class AdminMedicineController {

    private final MedicineSyncService sync;

    @PostMapping("/sync")
    public ResponseEntity<Map<String, Object>> runSync() {
        if (!sync.isConfigured()) {
            return ResponseEntity.badRequest().body(Map.of(
                    "status", "not_configured",
                    "message", "MEDICINE_SYNC_URL is not set in this environment"));
        }
        try {
            MedicineSyncService.SyncResult result = sync.sync();
            log.info("Manual medicine sync: {}", result.message());
            return ResponseEntity.ok(Map.of(
                    "status", "ok",
                    "medicines", result.medicines(),
                    "ingredients", result.ingredients(),
                    "prices", result.prices()));
        } catch (Exception e) {
            log.error("Manual medicine sync failed: {}", e.getMessage());
            return ResponseEntity.internalServerError().body(Map.of(
                    "status", "failed", "message", String.valueOf(e.getMessage())));
        }
    }
}
