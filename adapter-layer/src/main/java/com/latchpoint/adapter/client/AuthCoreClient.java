package com.latchpoint.adapter.client;

import com.latchpoint.adapter.dto.LoginRequest;
import com.latchpoint.adapter.dto.LoginResponse;
import com.latchpoint.adapter.dto.MfaVerifyRequest;
import com.latchpoint.adapter.dto.SessionValidateRequest;
import com.latchpoint.adapter.dto.SessionValidateResponse;
import com.latchpoint.adapter.exception.AuthCoreException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class AuthCoreClient {

    private static final Logger log = LoggerFactory.getLogger(AuthCoreClient.class);
    private final RestClient restClient;

    public AuthCoreClient(RestClient authCoreRestClient) {
        this.restClient = authCoreRestClient;
    }

    /**
     * Authenticate user credentials against Auth Core.
     * Returns LoginResponse with either session token or MFA challenge.
     */
    public LoginResponse login(LoginRequest request) {
        log.debug("Calling Auth Core /login for user: {}", request.username());

        return restClient.post()
                .uri("/login")
                .body(request)
                .retrieve()
                .onStatus(HttpStatusCode::isError, (req, res) -> {
                    log.warn("Auth Core /login failed with status: {}", res.getStatusCode());
                    throw new AuthCoreException("Login failed at Auth Core: " + res.getStatusText(),
                            res.getStatusCode());
                })
                .body(LoginResponse.class);
    }

    /**
     * Submit MFA TOTP code for a pending challenge.
     */
    public LoginResponse verifyMfa(MfaVerifyRequest request) {
        log.debug("Calling Auth Core /verify-mfa for challenge: {}", request.mfaChallengeId());

        return restClient.post()
                .uri("/verify-mfa")
                .body(request)
                .retrieve()
                .onStatus(HttpStatusCode::isError, (req, res) -> {
                    log.warn("Auth Core /verify-mfa failed with status: {}", res.getStatusCode());
                    throw new AuthCoreException("MFA verification failed at Auth Core", res.getStatusCode());
                })
                .body(LoginResponse.class);
    }

    /**
     * Check if a session token is still valid.
     */
    public SessionValidateResponse validateSession(SessionValidateRequest request) {
        log.debug("Calling Auth Core /session/validate");

        return restClient.post()
                .uri("/session/validate")
                .body(request)
                .retrieve()
                .onStatus(HttpStatusCode::isError, (req, res) -> {
                    log.warn("Auth Core /session/validate failed with status: {}", res.getStatusCode());
                    throw new AuthCoreException("Session validation failed at Auth Core", res.getStatusCode());
                })
                .body(SessionValidateResponse.class);
    }

    /**
     * Invalidate a session token on logout.
     */
    public void logout(String sessionToken) {
        log.debug("Calling Auth Core /logout");

        restClient.post()
                .uri("/logout")
                .body(new SessionValidateRequest(sessionToken))
                .retrieve()
                .onStatus(HttpStatusCode::isError, (req, res) -> {
                    log.warn("Auth Core /logout failed with status: {}", res.getStatusCode());
                    throw new AuthCoreException("Logout failed at Auth Core", res.getStatusCode());
                })
                .toBodilessEntity();
    }
}