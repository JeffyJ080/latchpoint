package com.latchpoint.auth.controller;

import com.latchpoint.auth.service.MfaService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/mfa")
public class MfaEnrollmentController {

    private final MfaService mfa;

    public MfaEnrollmentController(MfaService mfa) {
        this.mfa = mfa;
    }

    public record SetupRequest(@NotBlank String password) {
    }

    public record ConfirmRequest(
            @NotBlank @Pattern(regexp = "[0-9]{6}") String code) {
    }

    @PostMapping("/setup")
    public ResponseEntity<MfaService.EnrollmentSetup> setup(
            Principal principal,
            @Valid @RequestBody SetupRequest request) {
        return ResponseEntity.ok()
                .cacheControl(CacheControl.noStore())
                .body(mfa.startEnrollment(
                        principal.getName(),
                        request.password()));
    }

    @PostMapping("/confirm")
    public ResponseEntity<Void> confirm(
            Principal principal,
            @Valid @RequestBody ConfirmRequest request) {
        mfa.confirmEnrollment(
                principal.getName(),
                request.code());

        return ResponseEntity.noContent().build();
    }
}