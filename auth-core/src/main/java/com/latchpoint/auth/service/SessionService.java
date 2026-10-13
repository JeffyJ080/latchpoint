package com.latchpoint.auth.service;

import com.latchpoint.auth.config.AppProperties;
import com.latchpoint.auth.exception.AuthExceptions.InvalidSession;
import com.latchpoint.auth.model.Session;
import com.latchpoint.auth.model.User;
import com.latchpoint.auth.repository.SessionRepository;
import com.latchpoint.auth.security.JwtService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
public class SessionService {

    private final SessionRepository sessions;
    private final JwtService jwt;
    private final AppProperties props;
    private final EventLogService events;

    public SessionService(SessionRepository s, JwtService j, AppProperties p, EventLogService e) {
        this.sessions = s;
        this.jwt = j;
        this.props = p;
        this.events = e;
    }

    @Transactional
    public String createSession(User user) {
        Instant now = Instant.now();
        long sessionSeconds = props.getSession().getTimeoutMinutes() * 60;
        long jwtSeconds = props.getJwt().getExpiryMinutes() * 60;
        Instant exp = now.plusSeconds(Math.min(sessionSeconds, jwtSeconds));
        String jti = UUID.randomUUID().toString();

        Session s = new Session();
        s.setJti(jti);
        s.setUser(user);
        s.setCreatedAt(now);
        s.setExpiresAt(exp);
        sessions.save(s);

        String token = jwt.create(user.getUsername(), jti, exp);
        events.record("SESSION_CREATED", "success", user.getUsername());
        return token;
    }

    public Session validate(String token) {
        try {
            var claims = jwt.parse(token);
            Session s = sessions.findById(claims.getId()).orElseThrow(InvalidSession::new);
            if (s.getExpiresAt().isBefore(Instant.now())) {
                sessions.delete(s);
                throw new InvalidSession();
            }
            return s;
        } catch (InvalidSession e) {
            throw e;
        } catch (Exception e) {
            throw new InvalidSession();
        }
    }

    @Transactional
    public void invalidate(String token) {
        try {
            Session s = validate(token);
            sessions.delete(s);
            events.record("LOGOUT", "success", s.getUser().getUsername());
        } catch (InvalidSession ignored) {
        }
    }
}