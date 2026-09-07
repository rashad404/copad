package com.drcopad.copad.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.Instant;
import java.util.Map;

/**
 * Maps domain exceptions to HTTP responses.
 *
 * Without this, a rate-limit rejection surfaced as 500 Internal Server Error,
 * which tells a client nothing and encourages it to retry immediately.
 */
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RateLimitExceededException.class)
    public ResponseEntity<Map<String, Object>> handleRateLimit(RateLimitExceededException ex) {
        return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                .header(HttpHeaders.RETRY_AFTER, String.valueOf(ex.getRetryAfterSeconds()))
                .body(body(HttpStatus.TOO_MANY_REQUESTS, ex.getMessage()));
    }

    @ExceptionHandler(CostLimitExceededException.class)
    public ResponseEntity<Map<String, Object>> handleCostLimit(CostLimitExceededException ex) {
        log.warn("Cost limit exceeded: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.PAYMENT_REQUIRED)
                .body(body(HttpStatus.PAYMENT_REQUIRED, ex.getMessage()));
    }

    @ExceptionHandler(ConversationExpiredException.class)
    public ResponseEntity<Map<String, Object>> handleExpired(ConversationExpiredException ex) {
        return ResponseEntity.status(HttpStatus.GONE)
                .body(body(HttpStatus.GONE, ex.getMessage()));
    }

    private Map<String, Object> body(HttpStatus status, String message) {
        return Map.of(
                "timestamp", Instant.now().toString(),
                "status", status.value(),
                "error", status.getReasonPhrase(),
                "message", message == null ? status.getReasonPhrase() : message
        );
    }
}
