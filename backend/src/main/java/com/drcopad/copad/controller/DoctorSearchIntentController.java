package com.drcopad.copad.controller;

import com.drcopad.copad.service.DoctorSearchIntentService;
import com.drcopad.copad.service.RateLimitPolicy;
import com.drcopad.copad.service.RateLimiterService;
import com.drcopad.copad.util.ClientIpResolver;
import jakarta.servlet.http.HttpServletRequest;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Reading a sentence and deciding which doctors to show.
 *
 * Public: the people who describe a symptom rather than name a specialty are
 * exactly the ones who have never used the site before.
 */
@RestController
@RequestMapping("/api/doctors")
@RequiredArgsConstructor
public class DoctorSearchIntentController {

    private final DoctorSearchIntentService intents;
    private final RateLimiterService rateLimiter;

    @Data
    public static class Request {
        private String text;
    }

    @PostMapping("/search-intent")
    public ResponseEntity<Map<String, Object>> interpret(@RequestBody Request body,
                                                         HttpServletRequest request) {
        // Each call costs money and the endpoint is unauthenticated.
        rateLimiter.requireAll(RateLimitPolicy.GENERAL, ClientIpResolver.resolve(request));

        DoctorSearchIntentService.Intent intent = intents.interpret(body.getText());

        // Nulls are meaningful here, so the map is built rather than Map.of.
        Map<String, Object> out = new LinkedHashMap<>();
        out.put("specialty", intent.specialty());
        out.put("city", intent.city());
        out.put("query", intent.query());
        out.put("urgent", intent.urgent());
        return ResponseEntity.ok(out);
    }
}
