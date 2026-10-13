package com.latchpoint.adapter.dto;

import jakarta.validation.constraints.NotBlank;

public record LegacyLoginForm(
        @NotBlank(message = "Username is required") String username,

        @NotBlank(message = "Password is required") String password) {
}