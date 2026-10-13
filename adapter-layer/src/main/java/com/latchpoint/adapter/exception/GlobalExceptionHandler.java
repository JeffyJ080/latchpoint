package com.latchpoint.adapter.exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.client.ResourceAccessException;

import java.time.Instant;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    /**
     * Handles downstream Auth Core errors (e.g. 401 Invalid Credentials, 403, etc.)
     */
    @ExceptionHandler(AuthCoreException.class)
    public ResponseEntity<Map<String, Object>> handleAuthCoreException(AuthCoreException ex) {
        log.warn("Auth Core returned error: {} (status: {})", ex.getMessage(), ex.getStatusCode());

        return ResponseEntity.status(ex.getStatusCode()).body(Map.of(
                "error", "auth_error",
                "message", ex.getMessage(),
                "timestamp", Instant.now().toString()));
    }

    /**
     * Handles network / connection issues when Auth Core is offline or unreachable
     */
    @ExceptionHandler(ResourceAccessException.class)
    public ResponseEntity<Map<String, Object>> handleNetworkException(ResourceAccessException ex) {
        log.error("Unable to reach Auth Core service: {}", ex.getMessage());

        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(Map.of(
                "error", "service_unavailable",
                "message", "Authentication service is temporarily unreachable",
                "timestamp", Instant.now().toString()));
    }

    /**
     * Handles form validation errors (e.g., blank username or password)
     */
    @ExceptionHandler(BindException.class)
    public ResponseEntity<Map<String, Object>> handleValidationException(BindException ex) {
        String errorMessage = ex.getBindingResult().getFieldErrors().stream()
                .map(err -> err.getField() + ": " + err.getDefaultMessage())
                .findFirst()
                .orElse("Validation failed");

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                "error", "validation_error",
                "message", errorMessage,
                "timestamp", Instant.now().toString()));
    }
}