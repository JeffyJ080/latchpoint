package com.latchpoint.auth.service;

import com.latchpoint.auth.config.AppProperties;
import com.latchpoint.auth.dto.Responses.LoginResponse;
import com.latchpoint.auth.exception.AuthExceptions.*;
import com.latchpoint.auth.model.User;
import com.latchpoint.auth.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Service
public class AuthenticationService {

    private final UserRepository users;
    private final PasswordEncoder encoder;
    private final SessionService sessions;
    private final MfaService mfa;
    private final EventLogService events;
    private final AppProperties props;

    public AuthenticationService(UserRepository u, PasswordEncoder e, SessionService s,
            MfaService m, EventLogService ev, AppProperties p) {
        this.users = u;
        this.encoder = e;
        this.sessions = s;
        this.mfa = m;
        this.events = ev;
        this.props = p;
    }

    @Transactional
    public LoginResponse login(String username, String password, HttpServletRequest req) {
        User u = users.findByUsername(username).orElse(null);

        if (u == null || !u.isEnabled() || !encoder.matches(password, u.getPasswordHash())) {
            events.record("LOGIN_FAILED", "failed", username, req);
            throw new InvalidCredentials();
        }

        if (mfa.isMfaActive(u)) {
            return LoginResponse.mfa(mfa.createChallenge(u));
        }

        String token = sessions.createSession(u);
        events.record("LOGIN_SUCCESS", "success", username, req);

        return LoginResponse.session(
                token,
                sessions.validate(token).getExpiresAt().toString());
    }

    @Transactional
    public LoginResponse verifyMfa(String challengeId, String code) {
        User user = mfa.verify(challengeId, code);
        String token = sessions.createSession(user);

        events.record("MFA_VERIFICATION_SUCCESS", "success", user.getUsername());

        return LoginResponse.session(
                token,
                sessions.validate(token).getExpiresAt().toString());
    }
}