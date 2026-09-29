package com.latchpoint.adapter.exception;

import org.springframework.http.HttpStatusCode;

public class AuthCoreException extends RuntimeException {
    private final HttpStatusCode statusCode;

    public AuthCoreException(String message, HttpStatusCode statusCode) {
        super(message);
        this.statusCode = statusCode;
    }

    public HttpStatusCode getStatusCode() {
        return statusCode;
    }
}