package com.drcopad.copad.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Public liveness endpoint for external uptime monitoring.
 *
 * Actuator is deliberately not used for this: its health endpoint is
 * authenticated, and the informative version reports component internals that
 * should not be public. This returns only what a monitor needs to decide
 * whether to page someone.
 *
 * It does hit the database, because a process that is running but cannot reach
 * MySQL is not serving anyone - and "the port answers" was exactly the kind of
 * check that would have missed the outage this endpoint exists to catch.
 */
@Slf4j
@RestController
@RequestMapping("/api/health")
@RequiredArgsConstructor
public class HealthController {

    private final JdbcTemplate jdbcTemplate;

    @Value("${spring.application.name:copad}")
    private String applicationName;

    @GetMapping
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("service", applicationName);
        body.put("timestamp", Instant.now().toString());

        boolean databaseUp;
        try {
            jdbcTemplate.queryForObject("SELECT 1", Integer.class);
            databaseUp = true;
        } catch (Exception e) {
            // Message only: the exception can carry connection details.
            log.error("Health check failed: database unreachable ({})", e.getClass().getSimpleName());
            databaseUp = false;
        }

        body.put("database", databaseUp ? "up" : "down");
        body.put("status", databaseUp ? "UP" : "DOWN");

        return databaseUp
                ? ResponseEntity.ok(body)
                : ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(body);
    }
}
