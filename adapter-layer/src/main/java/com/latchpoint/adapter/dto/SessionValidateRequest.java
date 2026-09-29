package com.latchpoint.adapter.dto;

import jakarta.validation.constraints.NotBlank;

public record SessionValidateRequest(
        @NotBlank(message = "Session token is required") String sessionToken) {
}