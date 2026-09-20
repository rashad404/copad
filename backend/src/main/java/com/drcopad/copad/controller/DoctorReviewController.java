package com.drcopad.copad.controller;

import com.drcopad.copad.entity.Doctor;
import com.drcopad.copad.entity.DoctorReview;
import com.drcopad.copad.entity.User;
import com.drcopad.copad.repository.DoctorRepository;
import com.drcopad.copad.service.DoctorReviewService;
import com.drcopad.copad.service.RateLimitPolicy;
import com.drcopad.copad.service.RateLimiterService;
import com.drcopad.copad.util.ClientIpResolver;
import jakarta.servlet.http.HttpServletRequest;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Reading and writing reviews of a doctor.
 *
 * Open to somebody with no account, because most people who have just been to
 * a clinic do not have one, and a review nobody can leave is not a review
 * system. What that costs is moderation, which is the price of the honest
 * version.
 */
@RestController
@RequestMapping("/api/doctors")
@RequiredArgsConstructor
public class DoctorReviewController {

    private final DoctorReviewService reviews;
    private final DoctorRepository doctors;
    private final RateLimiterService rateLimiter;

    @Data
    public static class Request {
        private int rating;
        private String comment;
        private String authorName;
    }

    @GetMapping("/{slug}/reviews")
    public Map<String, Object> list(@PathVariable String slug,
                                    @RequestParam(defaultValue = "0") int page,
                                    @RequestParam(defaultValue = "10") int size) {
        Doctor doctor = doctors.findBySlugAndDeletedAtIsNull(slug)
                .orElseThrow(() -> new IllegalArgumentException("Doctor not found"));
        var found = reviews.published(doctor.getId(), page, size);

        Map<String, Object> out = new LinkedHashMap<>();
        out.put("total", found.getTotalElements());
        out.put("page", found.getNumber());
        out.put("totalPages", found.getTotalPages());
        out.put("average", doctor.getReviewCount() == 0 ? null
                : Math.round(doctor.getRatingTotal() * 10.0 / doctor.getReviewCount()) / 10.0);
        out.put("count", doctor.getReviewCount());
        out.put("reviews", found.getContent().stream().map(DoctorReviewController::view).toList());
        return out;
    }

    @PostMapping("/{slug}/reviews")
    public ResponseEntity<?> write(@PathVariable String slug,
                                   @RequestBody Request body,
                                   @AuthenticationPrincipal User user,
                                   HttpServletRequest request) {
        // Writing is unauthenticated, so it is bounded by address as well as
        // by the per-machine limit inside the service.
        rateLimiter.requireAll(RateLimitPolicy.GENERAL, ClientIpResolver.resolve(request));
        try {
            DoctorReview saved = reviews.write(slug,
                    new DoctorReviewService.NewReview(
                            body.getRating(), body.getComment(), body.getAuthorName()),
                    user, ClientIpResolver.resolve(request));

            Map<String, Object> out = new LinkedHashMap<>(view(saved));
            // The interface has to tell the person whether anybody can see it.
            out.put("published", saved.getStatus() == DoctorReview.Status.PUBLISHED);
            return ResponseEntity.status(HttpStatus.CREATED).body(out);
        } catch (IllegalStateException refused) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", refused.getMessage()));
        } catch (IllegalArgumentException bad) {
            return ResponseEntity.badRequest().body(Map.of("error", bad.getMessage()));
        }
    }

    /**
     * What a reader is shown.
     *
     * Never the email, never the address hash, never which appointment the
     * review came from: a verified badge says a visit happened, and nothing
     * else about it is anybody's business.
     */
    static Map<String, Object> view(DoctorReview review) {
        Map<String, Object> out = new LinkedHashMap<>();
        out.put("id", review.getId());
        out.put("rating", review.getRating());
        out.put("comment", review.getComment());
        out.put("authorName", review.getAuthorName());
        out.put("trust", review.getTrust().name());
        out.put("createdAt", review.getCreatedAt());
        return out;
    }

    static List<Map<String, Object>> views(List<DoctorReview> list) {
        return list.stream().map(DoctorReviewController::view).toList();
    }

    static LocalDateTime now() {
        return LocalDateTime.now();
    }
}
