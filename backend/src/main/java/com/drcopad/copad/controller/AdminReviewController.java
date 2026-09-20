package com.drcopad.copad.controller;

import com.drcopad.copad.entity.DoctorReview;
import com.drcopad.copad.service.DoctorReviewService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * The moderation queue.
 *
 * Guest reviews wait here. Somebody reads each one before it is attached to a
 * named doctor's profile, which is the whole reason guest reviews can be
 * allowed at all.
 */
@Slf4j
@RestController
@RequestMapping("/api/admin/reviews")
@RequiredArgsConstructor
public class AdminReviewController {

    private final DoctorReviewService reviews;

    @Data
    public static class Decision {
        private boolean publish;
        private String note;
    }

    @GetMapping
    public Map<String, Object> pending(@RequestParam(defaultValue = "0") int page,
                                       @RequestParam(defaultValue = "25") int size) {
        Page<DoctorReview> found = reviews.awaitingModeration(
                PageRequest.of(Math.max(page, 0), Math.min(Math.max(size, 1), 100)));

        Map<String, Object> out = new LinkedHashMap<>();
        out.put("total", found.getTotalElements());
        out.put("totalPages", found.getTotalPages());
        out.put("page", found.getNumber());
        out.put("reviews", found.getContent().stream().map(review -> {
            // The moderator sees more than a reader: which doctor it is about,
            // and what kind of reviewer wrote it.
            Map<String, Object> row = new LinkedHashMap<>(DoctorReviewController.view(review));
            row.put("doctorSlug", review.getDoctor().getSlug());
            row.put("doctorName", review.getDoctor().getFullName());
            row.put("status", review.getStatus().name());
            return row;
        }).toList());
        return out;
    }

    @PostMapping("/{id}")
    public Map<String, Object> decide(@PathVariable Long id, @RequestBody Decision decision) {
        DoctorReview saved = reviews.moderate(id, decision.isPublish(), decision.getNote());
        log.info("Review {} {}", id, saved.getStatus());
        Map<String, Object> out = new LinkedHashMap<>(DoctorReviewController.view(saved));
        out.put("status", saved.getStatus().name());
        return out;
    }
}
