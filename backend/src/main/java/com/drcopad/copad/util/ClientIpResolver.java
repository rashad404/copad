package com.drcopad.copad.util;

import jakarta.servlet.http.HttpServletRequest;

/**
 * Resolves the originating client IP.
 *
 * In production nginx and Apache both sit in front of the app, so
 * {@code getRemoteAddr()} is the proxy's own address. Every visitor would then
 * share one IP-keyed rate-limit bucket and lock each other out, so the
 * forwarded headers are consulted first.
 */
public final class ClientIpResolver {

    private static final String[] HEADERS = {
            "X-Forwarded-For",
            "X-Real-IP",
            "CF-Connecting-IP"
    };

    private ClientIpResolver() {
    }

    public static String resolve(HttpServletRequest request) {
        for (String header : HEADERS) {
            String value = request.getHeader(header);
            if (value != null && !value.isBlank() && !"unknown".equalsIgnoreCase(value)) {
                // X-Forwarded-For is a chain: client, proxy1, proxy2. The
                // left-most entry is the original client.
                int comma = value.indexOf(',');
                String candidate = (comma > -1 ? value.substring(0, comma) : value).trim();
                if (!candidate.isBlank()) {
                    return candidate;
                }
            }
        }
        return request.getRemoteAddr();
    }
}
