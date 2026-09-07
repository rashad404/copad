package com.drcopad.copad.controller;

import com.drcopad.copad.entity.*;
import com.drcopad.copad.service.VitalService;
import lombok.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/** Vital sign readings for one family member. */
@Slf4j
@RestController
@RequestMapping("/api/members/{memberId}/vitals")
@RequiredArgsConstructor
public class VitalController {

    private final VitalService vitals;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class VitalDTO {
        private Long id;
        private VitalType vitalType;
        private BigDecimal value;
        private String unit;
        /** What the person typed, so the UI can show their own units back. */
        private BigDecimal valueEntered;
        private String unitEntered;
        private LocalDateTime measuredAt;
        private VitalSource source;
        private AbnormalFlag abnormalFlag;
        private boolean abnormal;
        private String notes;

        public static VitalDTO from(VitalReading r) {
            return VitalDTO.builder()
                    .id(r.getId()).vitalType(r.getVitalType())
                    .value(r.getValueCanonical()).unit(r.getUnitCanonical())
                    .valueEntered(r.getValueEntered()).unitEntered(r.getUnitEntered())
                    .measuredAt(r.getMeasuredAt()).source(r.getSource())
                    .abnormalFlag(r.getAbnormalFlag())
                    .abnormal(r.getAbnormalFlag() != null && r.getAbnormalFlag().isAbnormal())
                    .notes(r.getNotes())
                    .build();
        }
    }

    @Data
    public static class RecordVitalRequest {
        private VitalType vitalType;
        private BigDecimal value;
        /** Optional; the canonical unit is assumed when omitted. */
        private String unit;
        private LocalDateTime measuredAt;
        private VitalSource source;
        private String notes;
    }

    @GetMapping
    public List<VitalDTO> recent(@PathVariable Long memberId,
                                 @AuthenticationPrincipal User user) {
        return vitals.recent(memberId, user.getId()).stream().map(VitalDTO::from).toList();
    }

    @GetMapping("/latest")
    public Map<VitalType, VitalDTO> latest(@PathVariable Long memberId,
                                           @AuthenticationPrincipal User user) {
        return vitals.latestByType(memberId, user.getId()).entrySet().stream()
                .collect(java.util.stream.Collectors.toMap(Map.Entry::getKey,
                        e -> VitalDTO.from(e.getValue())));
    }

    @GetMapping("/series/{type}")
    public List<VitalDTO> series(@PathVariable Long memberId, @PathVariable VitalType type,
                                 @AuthenticationPrincipal User user) {
        return vitals.series(memberId, user.getId(), type).stream().map(VitalDTO::from).toList();
    }

    @GetMapping("/trends")
    public List<VitalService.Trend> trends(@PathVariable Long memberId,
                                           @RequestParam(defaultValue = "90") int windowDays,
                                           @AuthenticationPrincipal User user) {
        return vitals.trends(memberId, user.getId(), windowDays);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public VitalDTO record(@PathVariable Long memberId,
                           @RequestBody RecordVitalRequest body,
                           @AuthenticationPrincipal User user) {
        // The value is a measurement about a person, so it is not logged.
        log.info("Recording {} for member {}", body.getVitalType(), memberId);
        return VitalDTO.from(vitals.record(memberId, user.getId(), body.getVitalType(),
                body.getValue(), body.getUnit(), body.getMeasuredAt(),
                body.getSource(), body.getNotes()));
    }

    @DeleteMapping("/{readingId}")
    public ResponseEntity<Void> delete(@PathVariable Long memberId, @PathVariable Long readingId,
                                       @AuthenticationPrincipal User user) {
        vitals.delete(readingId, user.getId());
        return ResponseEntity.noContent().build();
    }
}
