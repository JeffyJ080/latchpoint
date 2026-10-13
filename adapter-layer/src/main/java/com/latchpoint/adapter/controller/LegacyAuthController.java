package com.latchpoint.adapter.controller;

import com.latchpoint.adapter.client.AuthCoreClient;
import com.latchpoint.adapter.dto.LegacyLoginForm;
import com.latchpoint.adapter.dto.LegacyMfaForm;
import com.latchpoint.adapter.dto.LoginRequest;
import com.latchpoint.adapter.dto.LoginResponse;
import com.latchpoint.adapter.dto.MfaVerifyRequest;
import com.latchpoint.adapter.dto.SessionValidateRequest;
import com.latchpoint.adapter.dto.SessionValidateResponse;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;

@RestController
@RequestMapping("/api/v1/legacy")
public class LegacyAuthController {

    private static final Logger log = LoggerFactory.getLogger(LegacyAuthController.class);
    private static final String COOKIE_NAME = "LATCHPOINT_SESSION";

    private final AuthCoreClient authCoreClient;

    public LegacyAuthController(AuthCoreClient authCoreClient) {
        this.authCoreClient = authCoreClient;
    }

    /**
     * 1. Legacy Form Login
     * Accepts standard form-encoded data (HTML form POST) or JSON.
     * Translates input -> Auth Core JSON -> Sets secure session cookie on success.
     */
    @PostMapping(value = "/login", consumes = {
            MediaType.APPLICATION_FORM_URLENCODED_VALUE,
            MediaType.APPLICATION_JSON_VALUE
    })
    public ResponseEntity<LoginResponse> login(@Valid @ModelAttribute LegacyLoginForm form) {
        log.info("Received legacy login attempt for user: {}", form.username());

        LoginRequest request = new LoginRequest(form.username(), form.password());
        LoginResponse response = authCoreClient.login(request);

        // If MFA is required, return challenge response without setting a session
        // cookie yet
        if (response.isMfaRequired()) {
            log.info("MFA required for user: {}", form.username());
            return ResponseEntity.ok(response);
        }

        // Authentication succeeded: generate legacy session cookie
        ResponseCookie sessionCookie = createSessionCookie(response.sessionToken(), Duration.ofHours(24));

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, sessionCookie.toString())
                .body(response);
    }

    /**
     * 2. Legacy MFA Verification
     * Accepts MFA challenge ID and code, verifies against Auth Core, and issues
     * session cookie.
     */
    @PostMapping(value = "/verify-mfa", consumes = {
            MediaType.APPLICATION_FORM_URLENCODED_VALUE,
            MediaType.APPLICATION_JSON_VALUE
    })
    public ResponseEntity<LoginResponse> verifyMfa(@Valid @ModelAttribute LegacyMfaForm form) {
        log.info("Received legacy MFA verification for challenge: {}", form.mfaChallengeId());

        MfaVerifyRequest request = new MfaVerifyRequest(form.mfaChallengeId(), form.code());
        LoginResponse response = authCoreClient.verifyMfa(request);

        ResponseCookie sessionCookie = createSessionCookie(response.sessionToken(), Duration.ofHours(24));

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, sessionCookie.toString())
                .body(response);
    }

    /**
     * 3. Legacy Session Check
     * Middleware in the legacy app calls this endpoint passing the cookie or
     * header.
     */
    @GetMapping("/check-session")
    public ResponseEntity<SessionValidateResponse> checkSession(
            @CookieValue(name = COOKIE_NAME, required = false) String cookieToken,
            @RequestHeader(name = "X-Session-Token", required = false) String headerToken) {

        String token = (cookieToken != null && !cookieToken.isBlank()) ? cookieToken : headerToken;

        if (token == null || token.isBlank()) {
            return ResponseEntity.status(401).body(new SessionValidateResponse(false, null, null));
        }

        SessionValidateResponse response = authCoreClient.validateSession(new SessionValidateRequest(token));

        if (!response.valid()) {
            return ResponseEntity.status(401).body(response);
        }

        return ResponseEntity.ok(response);
    }

    /**
     * 4. Legacy Logout
     * Invalidates token in Auth Core and clears the browser session cookie.
     */
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(
            @CookieValue(name = COOKIE_NAME, required = false) String cookieToken,
            @RequestHeader(name = "X-Session-Token", required = false) String headerToken) {

        String token = (cookieToken != null && !cookieToken.isBlank()) ? cookieToken : headerToken;

        if (token != null && !token.isBlank()) {
            try {
                authCoreClient.logout(token);
            } catch (Exception e) {
                log.warn("Auth Core logout failed (session may already be expired): {}", e.getMessage());
            }
        }

        // Clear cookie by setting Max-Age to 0
        ResponseCookie clearCookie = createSessionCookie("", Duration.ZERO);

        return ResponseEntity.noContent()
                .header(HttpHeaders.SET_COOKIE, clearCookie.toString())
                .build();
    }

    private ResponseCookie createSessionCookie(String token, Duration maxAge) {
        return ResponseCookie.from(COOKIE_NAME, token)
                .httpOnly(true)
                .secure(false) // TODO: Set to true in production with HTTPS
                .path("/")
                .maxAge(maxAge)
                .sameSite("Lax")
                .build();
    }
}