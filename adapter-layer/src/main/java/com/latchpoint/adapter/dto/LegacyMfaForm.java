package com.latchpoint.adapter.dto;

import jakarta.validation.constraints.NotBlank;

public record LegacyMfaForm(
        @NotBlank(message = "MFA Challenge ID is required") String mfaChallengeId,

        @NotBlank(message = "Code is required") String code) {
}