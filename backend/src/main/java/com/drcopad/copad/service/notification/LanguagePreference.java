package com.drcopad.copad.service.notification;

import com.drcopad.copad.entity.User;
import com.drcopad.copad.repository.UserRepository;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Remembers which language somebody is reading in.
 *
 * Taken from the interface they are using rather than asked for, because being
 * asked to pick a language twice is the sort of thing that makes a product feel
 * careless. It is read from the cookie the frontend already sets.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class LanguagePreference {

    private static final String COOKIE = "i18nextLng";

    private final UserRepository users;

    @Transactional
    public void noteFrom(HttpServletRequest request, Long userId) {
        if (request == null || userId == null) return;
        String language = normalise(fromCookie(request));
        if (language == null) return;

        users.findById(userId).ifPresent(user -> {
            if (language.equals(user.getPreferredLanguage())) return;
            user.setPreferredLanguage(language);
            users.save(user);
        });
    }

    /** The language to write to this person in, never null. */
    public static String of(User user) {
        String chosen = user == null ? null : user.getPreferredLanguage();
        String normalised = normalise(chosen);
        return normalised == null ? "az" : normalised;
    }

    private static String fromCookie(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies == null) return null;
        for (Cookie cookie : cookies) {
            if (COOKIE.equals(cookie.getName())) return cookie.getValue();
        }
        return null;
    }

    private static String normalise(String value) {
        if (value == null || value.isBlank()) return null;
        return switch (value.toLowerCase().split("-")[0]) {
            case "en" -> "en";
            case "ru" -> "ru";
            case "az" -> "az";
            default -> null;
        };
    }
}
