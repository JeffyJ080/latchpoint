package com.latchpoint.adapter.dto;

import jakarta.validation.constraints.NotBlank;

public record MfaVerifyRequest(
        @NotBlank(message = "MFA Challenge ID is required") String mfaChallengeId,

        @NotBlank(message = "MFA code is required") String code) {
}