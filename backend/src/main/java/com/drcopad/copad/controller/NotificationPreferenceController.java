package com.drcopad.copad.controller;

import com.drcopad.copad.entity.User;
import com.drcopad.copad.repository.UserRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Whether we may write to somebody, and in which language.
 *
 * Its own endpoint rather than part of the profile: turning messages off is
 * something a person should be able to do without editing anything else about
 * themselves.
 */
@RestController
@RequestMapping("/api/user/notifications")
@RequiredArgsConstructor
public class NotificationPreferenceController {

    private final UserRepository users;

    @Data
    public static class Preferences {
        private Boolean enabled;
        private String language;
    }

    @GetMapping
    public Map<String, Object> get(@AuthenticationPrincipal User principal) {
        User user = users.findById(principal.getId()).orElseThrow();
        return Map.of(
                "enabled", user.isNotificationsEnabled(),
                "language", user.getPreferredLanguage() == null
                        ? "az" : user.getPreferredLanguage());
    }

    @PutMapping
    public Map<String, Object> update(@RequestBody Preferences body,
                                      @AuthenticationPrincipal User principal) {
        User user = users.findById(principal.getId()).orElseThrow();
        if (body.getEnabled() != null) {
            user.setNotificationsEnabled(body.getEnabled());
        }
        if (body.getLanguage() != null) {
            String language = switch (body.getLanguage().toLowerCase()) {
                case "en" -> "en";
                case "ru" -> "ru";
                default -> "az";
            };
            user.setPreferredLanguage(language);
        }
        users.save(user);
        return Map.of(
                "enabled", user.isNotificationsEnabled(),
                "language", user.getPreferredLanguage() == null
                        ? "az" : user.getPreferredLanguage());
    }
}
