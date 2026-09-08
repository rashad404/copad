package com.drcopad.copad.controller;

import com.drcopad.copad.entity.User;
import com.drcopad.copad.repository.UserRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.drcopad.copad.service.notification.SmsSender;

import java.util.LinkedHashMap;
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
    private final SmsSender sms;

    @Data
    public static class Preferences {
        private Boolean enabled;
        private String language;
        private String phone;
        private Boolean smsEnabled;
    }

    /**
     * Digits and a leading plus, as typed.
     *
     * Not validated against an Azerbaijani prefix: people here carry Turkish,
     * Russian and Georgian numbers, and rejecting one because it does not start
     * 994 would be rejecting the person.
     */
    private static String cleanPhone(String raw) {
        if (raw == null) return null;
        String trimmed = raw.replaceAll("[^+0-9]", "");
        if (trimmed.isBlank()) return null;
        return trimmed.length() > 32 ? trimmed.substring(0, 32) : trimmed;
    }

    private Map<String, Object> view(User user) {
        Map<String, Object> out = new LinkedHashMap<>();
        out.put("enabled", user.isNotificationsEnabled());
        out.put("language", user.getPreferredLanguage() == null
                ? "az" : user.getPreferredLanguage());
        out.put("phone", user.getPhone() == null ? "" : user.getPhone());
        out.put("smsEnabled", user.isSmsEnabled());
        // So the interface can say messages go by email today, rather than
        // offering a channel that would silently fall back to one.
        out.put("smsAvailable", sms.available());
        return out;
    }

    @GetMapping
    public Map<String, Object> get(@AuthenticationPrincipal User principal) {
        return view(users.findById(principal.getId()).orElseThrow());
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
        if (body.getPhone() != null) {
            user.setPhone(cleanPhone(body.getPhone()));
        }
        if (body.getSmsEnabled() != null) {
            user.setSmsEnabled(body.getSmsEnabled());
        }
        // Turning texts on without a number would leave somebody believing
        // they had, so the two move together.
        if (user.getPhone() == null || user.getPhone().isBlank()) {
            user.setSmsEnabled(false);
        }
        users.save(user);
        return view(user);
    }
}
