package com.drcopad.copad.config;

import jakarta.servlet.http.HttpServletRequest;

import java.util.List;

/**
 * Which of our sites a request arrived at.
 *
 * azdoc.ai and virtualhekim.az are the same application behind one vhost, so
 * the answer has to come from the request rather than a constant. It used to be
 * worked out from X-Forwarded-Host, which never arrives: forward-headers-strategy
 * is on, and Spring's ForwardedHeaderFilter applies those headers to the request
 * and strips them before any controller reads them. Every lookup therefore fell
 * through to a hardcoded virtualhekim.az, and somebody who signed in at azdoc.ai
 * was handed back to the other domain.
 *
 * The request itself is the reliable source, precisely because that filter has
 * already rewritten it to describe the original call.
 */
public final class SiteOrigin {

    private SiteOrigin() {
    }

    /** Hosts we will send a browser to. Anything else is ignored. */
    private static final List<String> KNOWN = List.of(
            "azdoc.ai", "www.azdoc.ai",
            "virtualhekim.az", "www.virtualhekim.az",
            "logman.az", "www.logman.az");

    /** Where to go when the request tells us nothing, as on an odd callback. */
    public static final String FALLBACK = "https://azdoc.ai";

    /**
     * The site this request is for, as a scheme and host with no trailing slash.
     *
     * Falls back through Origin and Referer for the case where the request
     * arrives somewhere unexpected, and finally to azdoc.ai.
     */
    public static String of(HttpServletRequest request) {
        if (request == null) return FALLBACK;

        String host = request.getServerName();
        if (isLocal(host)) {
            // Development: keep the port, it is how the caller reached us.
            return request.getScheme() + "://" + host + portSuffix(request);
        }
        if (host != null && KNOWN.contains(host.toLowerCase())) {
            return "https://" + host.toLowerCase();
        }

        String fromHeader = matchKnown(request.getHeader("Origin"));
        if (fromHeader != null) return fromHeader;

        fromHeader = matchKnown(request.getHeader("Referer"));
        if (fromHeader != null) return fromHeader;

        return FALLBACK;
    }

    /**
     * The frontend for this request.
     *
     * The same origin in production, where one server answers for both; in
     * development the frontend is on its own port.
     */
    public static String frontendOf(HttpServletRequest request) {
        if (request != null && isLocal(request.getServerName())) {
            return "http://" + request.getServerName() + ":3000";
        }
        return of(request);
    }

    private static String matchKnown(String value) {
        if (value == null || value.isBlank()) return null;
        String lower = value.toLowerCase();
        for (String host : KNOWN) {
            // Bounded by "//" and a delimiter so "azdoc.ai.evil.test" cannot match.
            if (lower.startsWith("https://" + host + "/")
                    || lower.equals("https://" + host)) {
                return "https://" + host;
            }
        }
        return null;
    }

    private static boolean isLocal(String host) {
        return host != null && ("localhost".equals(host) || "127.0.0.1".equals(host)
                || host.startsWith("192.168.") || host.startsWith("10."));
    }

    private static String portSuffix(HttpServletRequest request) {
        int port = request.getServerPort();
        return port == 80 || port == 443 ? "" : ":" + port;
    }
}
