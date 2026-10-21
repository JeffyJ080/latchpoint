package com.latchpoint.auth.service;

import com.latchpoint.auth.config.AppProperties;
import com.latchpoint.auth.exception.AuthExceptions.InvalidMfa;
import com.latchpoint.auth.exception.AuthExceptions.TooManyAttempts;
import com.latchpoint.auth.model.User;
import com.latchpoint.auth.model.UserMfa;
import com.latchpoint.auth.repository.UserMfaRepository;
import com.warrenstrange.googleauth.GoogleAuthenticator;
import org.springframework.stereotype.Service;
import com.latchpoint.auth.exception.AuthExceptions.TooManyAttempts;
import com.latchpoint.auth.repository.AuthEventRepository;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class MfaService {

    public record PendingChallenge(User user, Instant expiresAt) {
    }

    private final UserMfaRepository mfaRepo;
    private final AppProperties props;
    private final GoogleAuthenticator auth = new GoogleAuthenticator();
    private final EventLogService events;
    private final Map<String, PendingChallenge> challenges = new ConcurrentHashMap<>();
    private final AuthEventRepository authEvents;

    public MfaService(UserMfaRepository r, AppProperties p, EventLogService e, AuthEventRepository authEvents) {
        this.mfaRepo = r;
        this.props = p;
        this.events = e;
        this.authEvents = authEvents;
    }

    public boolean isMfaActive(User user) {
        return mfaRepo.findByUser(user).filter(UserMfa::isActive).isPresent();
    }

    public String createChallenge(User user) {
        String challengeId = UUID.randomUUID().toString();
        Instant exp = Instant.now().plusSeconds(props.getMfa().getChallengeMinutes() * 60);
        challenges.put(challengeId, new PendingChallenge(user, exp));
        return challengeId;
    }

    public synchronized User verify(String challengeId, String code) {
        Instant now = Instant.now();

        PendingChallenge challenge = challenges.get(challengeId);

        if (challenge == null) {
            throw new InvalidMfa();
        }

        if (!challenge.expiresAt().isAfter(now)) {
            challenges.remove(challengeId);
            throw new InvalidMfa();
        }

        User user = challenge.user();
        String username = user.getUsername();

        Instant windowStart = now.minusSeconds(
                props.getRateLimit().getBlockMinutes() * 60);

        long failures = authEvents
                .countByEventTypeAndDetailsAndTimestampAfter(
                        "MFA_FAILED",
                        "failed | user=" + username,
                        windowStart);

        if (failures >= props.getRateLimit().getMaxFailures()) {
            challenges.remove(challengeId);
            throw new TooManyAttempts();
        }

        UserMfa userMfa = mfaRepo.findByUser(user)
                .filter(UserMfa::isActive)
                .orElse(null);

        if (userMfa == null) {
            challenges.remove(challengeId);
            throw new InvalidMfa();
        }

        boolean valid = false;

        if (code != null && code.matches("[0-9]{6}")) {
            valid = auth.authorize(
                    userMfa.getSecret(),
                    Integer.parseInt(code));
        }

        if (!valid) {
            events.record("MFA_FAILED", "failed", username);

            if (failures + 1 >= props.getRateLimit().getMaxFailures()) {
                challenges.remove(challengeId);
                throw new TooManyAttempts();
            }

            throw new InvalidMfa();
        }

        challenges.remove(challengeId);
        events.record("MFA_SUCCESS", "success", username);

        return user;
    }
}