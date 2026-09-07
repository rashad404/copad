package com.drcopad.copad.controller;

import com.drcopad.copad.entity.ConsentType;
import com.drcopad.copad.entity.User;
import com.drcopad.copad.service.ConsentService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * What a person has agreed to, and how they change it.
 *
 * Readable by the person it concerns. Someone should be able to see what they
 * consented to and when, without asking us.
 */
@Slf4j
@RestController
@RequestMapping("/api/account/consent")
@RequiredArgsConstructor
public class ConsentController {

    private final ConsentService consents;

    @Data
    public static class ConsentRequest {
        private ConsentType type;
        /** Only for a guardian attestation. */
        private Long familyMemberId;
    }

    @GetMapping
    public Map<String, Object> mine(@AuthenticationPrincipal User user) {
        return consents.summary(user.getId());
    }

    @PostMapping
    public Map<String, Object> grant(@RequestBody ConsentRequest request,
                                     @AuthenticationPrincipal User user) {
        if (request.getType() == null) {
            throw new IllegalArgumentException("A consent type is required");
        }
        consents.grant(user.getId(), request.getType(), request.getFamilyMemberId());
        return consents.summary(user.getId());
    }

    /**
     * Withdraws a consent.
     *
     * Withdrawing CROSS_BORDER_AI genuinely stops content being sent for
     * processing; it is not only a record of preference.
     */
    @DeleteMapping("/{type}")
    public ResponseEntity<Map<String, Object>> withdraw(@PathVariable ConsentType type,
                                                        @AuthenticationPrincipal User user) {
        consents.withdraw(user.getId(), type);
        return ResponseEntity.ok(consents.summary(user.getId()));
    }
}
