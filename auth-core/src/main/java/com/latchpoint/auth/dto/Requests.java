package com.latchpoint.auth.dto;

import jakarta.validation.constraints.*;

public final class Requests { private Requests() {}
 public record LoginRequest(@NotBlank String username,@NotBlank String password){}
 public record MfaVerifyRequest(@NotBlank String mfaChallengeId,@NotBlank @Pattern(regexp="\\d{6}") String code){}
 public record SessionValidateRequest(@NotBlank String sessionToken){}
}
