    package com.latchpoint.adapter.dto;

    import com.fasterxml.jackson.annotation.JsonInclude;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public record LoginResponse(
        String sessionToken,
        String expiresAt,
        Boolean mfaRequired,
        String mfaChallengeId
    ) {
        public boolean isMfaRequired() {
            return Boolean.TRUE.equals(mfaRequired);
        }
    }