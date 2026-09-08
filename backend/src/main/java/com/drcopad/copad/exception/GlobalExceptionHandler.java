package com.drcopad.copad.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
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

    /**
     * The configured cap, because Tomcat does not always report it on the
     * exception and "too large" without a number is not actionable.
     */
    @org.springframework.beans.factory.annotation.Value("${spring.servlet.multipart.max-file-size:25MB}")
    private String maxUploadSize;

    /**
     * A request that no longer makes sense against the current state.
     *
     * Cancelling an order that is already cancelled, answering an appointment
     * that is closed. The caller asked for something reasonable at a moment
     * when it was not possible - that is a conflict, not a fault in the server,
     * and returning 500 made a normal outcome look like a crash.
     */
    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<Map<String, Object>> conflict(IllegalStateException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(body(HttpStatus.CONFLICT, ex.getMessage()));
    }

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

    /**
     * Domain validation failures. Without this they surfaced as 500 with a Java
     * stack trace in the response body, which tells a client nothing useful and
     * leaks internals.
     */
    /**
     * The day's AI budget is gone.
     *
     * 503 with a Retry-After to the next midnight: the service is genuinely
     * unavailable rather than the request being wrong, and a client that retries
     * in a second only burns the same wall it just hit.
     */
    @ExceptionHandler(com.drcopad.copad.service.AiSpendService.BudgetExhaustedException.class)
    public ResponseEntity<Map<String, Object>> handleBudgetExhausted(
            com.drcopad.copad.service.AiSpendService.BudgetExhaustedException ex) {
        long secondsToMidnight = java.time.Duration.between(
                java.time.LocalDateTime.now(),
                java.time.LocalDate.now().plusDays(1).atStartOfDay()).getSeconds();
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                .header(HttpHeaders.RETRY_AFTER, String.valueOf(Math.max(secondsToMidnight, 60)))
                .body(body(HttpStatus.SERVICE_UNAVAILABLE, ex.getMessage()));
    }

    /**
     * A file larger than the container will accept.
     *
     * Spring rejects it before any controller runs, and the default response
     * has an empty body - so the person is told only "413", and the interface
     * has nothing to show them. The size that was refused is the one fact that
     * makes the refusal actionable.
     */
    @ExceptionHandler(org.springframework.web.multipart.MaxUploadSizeExceededException.class)
    public ResponseEntity<Map<String, Object>> handleUploadTooLarge(
            org.springframework.web.multipart.MaxUploadSizeExceededException ex) {
        long maxBytes = ex.getMaxUploadSize();
        String limit = maxBytes > 0 ? (maxBytes / 1024 / 1024) + " MB" : maxUploadSize;
        return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE)
                .body(body(HttpStatus.PAYLOAD_TOO_LARGE,
                        "The file is larger than " + limit + "."));
    }

    /**
     * The appointment slot went to somebody else.
     *
     * 409 rather than 400: nothing was wrong with the request, the world moved
     * between choosing a time and confirming it. Two people reaching for the
     * last slot is the ordinary case, and the interface should offer the next
     * time rather than an apology.
     */
    @ExceptionHandler(com.drcopad.copad.service.BookingService.SlotTakenException.class)
    public ResponseEntity<Map<String, Object>> handleSlotTaken(
            com.drcopad.copad.service.BookingService.SlotTakenException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(body(HttpStatus.CONFLICT, ex.getMessage()));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, Object>> handleIllegalArgument(IllegalArgumentException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(body(HttpStatus.BAD_REQUEST, ex.getMessage()));
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Map<String, Object>> handleAccessDenied(AccessDeniedException ex) {
        // No detail: whether a family exists is not something a stranger should
        // be able to learn by comparing error messages.
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(body(HttpStatus.FORBIDDEN, "Access denied"));
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
