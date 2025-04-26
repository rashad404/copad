package com.drcopad.copad.config;

import java.util.List;

public class PublicEndpoints {

    public static final List<String> PUBLIC_URLS = List.of(
            "/api/**",         // Allow ALL /api/ requests
            "/custom-error"    // Allow custom error page separately
    );
}