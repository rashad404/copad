package com.drcopad.copad.service.notification;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

/**
 * Sends a text through whichever provider we end up with.
 *
 * Deliberately not written against one gateway. The Azerbaijani aggregators
 * all take an HTTP request with a number and a body and differ only in the
 * shape of it, so the shape is configuration: a URL, a body template with
 * {phone} and {text} in it, and one header. Signing up somewhere is then env
 * vars rather than a release.
 *
 * Off unless configured. With no provider set it refuses rather than pretending
 * to have sent something, which is what keeps a queued message queued instead
 * of quietly marked delivered.
 */
@Slf4j
@Service
public class SmsSender {

    private final HttpClient http = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();

    @Value("${app.sms.enabled:false}")
    private boolean enabled;

    @Value("${app.sms.url:}")
    private String url;

    /** The provider's own request body, with {phone} and {text} left in it. */
    @Value("${app.sms.body:}")
    private String bodyTemplate;

    @Value("${app.sms.content-type:application/json}")
    private String contentType;

    /** One header, which is how every one of them does authentication. */
    @Value("${app.sms.auth-header:}")
    private String authHeader;

    @Value("${app.sms.auth-value:}")
    private String authValue;

    /** Whether a text can go out at all. */
    public boolean available() {
        return enabled && !url.isBlank() && !bodyTemplate.isBlank();
    }

    /**
     * Sends one message, or throws.
     *
     * Throwing is what the sender needs: the notification row counts the
     * attempt and is tried again, rather than being marked sent because
     * nothing complained.
     */
    public void send(String phone, String text) {
        if (!available()) {
            throw new IllegalStateException("No SMS provider configured");
        }
        String body = bodyTemplate
                .replace("{phone}", escape(phone))
                .replace("{text}", escape(text));

        HttpRequest.Builder request = HttpRequest.newBuilder(URI.create(url))
                .timeout(Duration.ofSeconds(20))
                .header("Content-Type", contentType)
                .POST(HttpRequest.BodyPublishers.ofString(body));
        if (!authHeader.isBlank()) request.header(authHeader, authValue);

        HttpResponse<String> response;
        try {
            response = http.send(request.build(), HttpResponse.BodyHandlers.ofString());
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new IllegalStateException("SMS send interrupted");
        } catch (Exception e) {
            throw new IllegalStateException("SMS provider unreachable");
        }

        if (response.statusCode() >= 300) {
            // The number is not logged, and neither is the provider's body: a
            // rejection commonly quotes the number back.
            log.warn("SMS provider refused with status {}", response.statusCode());
            throw new IllegalStateException("SMS provider refused");
        }
    }

    /**
     * Enough escaping for a JSON string, which is what every one of these
     * bodies is. A form-encoded provider would need its own, and the day we
     * have one it can be added; guessing now would be guessing.
     */
    private static String escape(String value) {
        StringBuilder out = new StringBuilder(value.length() + 8);
        for (char c : value.toCharArray()) {
            switch (c) {
                case '"' -> out.append("\\\"");
                case '\\' -> out.append("\\\\");
                case '\n' -> out.append("\\n");
                case '\r' -> out.append("\\r");
                case '\t' -> out.append("\\t");
                default -> {
                    if (c < 0x20) out.append(String.format("\\u%04x", (int) c));
                    else out.append(c);
                }
            }
        }
        return out.toString();
    }
}
