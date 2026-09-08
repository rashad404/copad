package com.drcopad.copad.config;

import java.util.List;

public class PublicEndpoints {

    public static final List<String> PUBLIC_URLS = List.of(
            "/api/auth/**",
            "/api/oauth2/**",
            "/api/guest/**",
            "/api/tags/**",
            "/api/blog/**",
            "/api/v2/messages/**", // Responses API endpoints
            // Chat attachments. Not authenticated because the people who
            // upload them are guests; the controller checks that the request
            // carries the session the file belongs to.
            "/api/attachments/*",
            "/api/health",
            // The published drug registry; the allergy check under
            // /api/members/** stays authenticated.
            // The doctor directory. Public because being found is the point,
            // and every listing carries its own verification status.
            "/api/doctors",
            "/api/doctors/*",
            "/api/doctors/*/slots",
            "/api/doctors/sitemap",
            // The laboratory directory is browsable without an account, like the
            // doctor directory. Ordering is not: that lives under a member.
            "/api/labs",
            "/api/labs/*",
            "/api/labs/*/tests",
            "/api/labs/compare/*",
            "/api/labs/comparable",
            "/api/medicines",
            "/api/medicines/*",
            "/api/medicines/*/alternatives",
            "/custom-error"
    );
}
