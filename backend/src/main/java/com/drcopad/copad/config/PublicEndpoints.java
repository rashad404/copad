package com.drcopad.copad.config;

import java.util.List;

public class PublicEndpoints {

    public static final List<String> PUBLIC_URLS = List.of(
            "/api/auth/**",
            "/api/oauth2/**",
            "/api/guest/**",
            "/api/tags/**",
            "/api/blog/**",
            "/uploads/**", // Make uploads publicly accessible
            "/custom-error"
    );
}
