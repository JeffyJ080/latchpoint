package com.latchpoint.auth.service;

import com.latchpoint.auth.config.AppProperties;
import com.latchpoint.auth.exception.AuthExceptions.InvalidMfa;
import com.latchpoint.auth.exception.AuthExceptions.TooManyAttempts;
import com.latchpoint.auth.model.User;
import com.latchpoint.auth.model.UserMfa;
import com.latchpoint.auth.repository.UserMfaRepository;
import com.warrenstrange.googleauth.GoogleAuthenticator;
import org.springframework.stereotype.Service;
import com.latchpoint.auth.repository.AuthEventRepository;
import com.latchpoint.auth.exception.AuthExceptions.InvalidCredentials;
import com.latchpoint.auth.exception.AuthExceptions.InvalidConfiguration;
import com.latchpoint.auth.repository.UserRepository;
import com.latchpoint.auth.repository.SessionRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import com.latchpoint.auth.repository.ConfigurationRepository;

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
    private final UserRepository users;
    private final PasswordEncoder encoder;
    private final SessionRepository sessions;
    private final ConfigurationRepository configs;

    public MfaService(UserMfaRepository r, AppProperties p, EventLogService e, AuthEventRepository authEvents,
            UserRepository users, PasswordEncoder encoder, SessionRepository sessions,
            ConfigurationRepository configs) {
        this.mfaRepo = r;
        this.props = p;
        this.events = e;
        this.authEvents = authEvents;
        this.users = users;
        this.encoder = encoder;
        this.sessions = sessions;
        this.configs = configs;
    }

    public record EnrollmentSetup(String secret, String expiresAt) {
    }

    private record PendingEnrollment(String secret, Instant expiresAt) {
    }

    private final Map<String, PendingEnrollment> enrollments = new ConcurrentHashMap<>();

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

    private void checkEnrollmentLimit(String username) {
        Instant since = Instant.now().minusSeconds(
                props.getRateLimit().getBlockMinutes() * 60);

        long failures = authEvents
                .countByEventTypeAndDetailsAndTimestampAfter(
                        "MFA_FAILED",
                        "failed | user=" + username,
                        since);

        if (failures >= props.getRateLimit().getMaxFailures()) {
            throw new TooManyAttempts();
        }
    }

    private User enrollmentUser(String username) {
        return users.findByUsername(username)
                .filter(User::isEnabled)
                .orElseThrow(InvalidCredentials::new);
    }

    public synchronized EnrollmentSetup startEnrollment(
            String username,
            String password) {
        checkEnrollmentLimit(username);

        User user = enrollmentUser(username);

        if (!encoder.matches(password, user.getPasswordHash())) {
            events.record("MFA_FAILED", "failed", username);
            throw new InvalidCredentials();
        }

        if (isMfaActive(user)) {
            throw new InvalidConfiguration("mfa_already_enabled");
        }

        Instant now = Instant.now();

        enrollments.entrySet().removeIf(
                entry -> !entry.getValue().expiresAt().isAfter(now));

        PendingEnrollment pending = enrollments.get(username);

        if (pending == null) {
            if (enrollments.size() >= 1000) {
                throw new TooManyAttempts();
            }

            pending = new PendingEnrollment(
                    auth.createCredentials().getKey(),
                    now.plusSeconds(props.getMfa().getChallengeMinutes() * 60));

            enrollments.put(username, pending);
        }

        return new EnrollmentSetup(
                pending.secret(),
                pending.expiresAt().toString());
    }

    @Transactional
    public synchronized void confirmEnrollment(
            String username,
            String code) {
        checkEnrollmentLimit(username);

        User user = enrollmentUser(username);
        PendingEnrollment pending = enrollments.get(username);

        if (pending == null ||
                !pending.expiresAt().isAfter(Instant.now())) {
            enrollments.remove(username);
            throw new InvalidMfa();
        }

        if (isMfaActive(user)) {
            enrollments.remove(username);
            throw new InvalidConfiguration("mfa_already_enabled");
        }

        boolean valid = code != null
                && code.matches("[0-9]{6}")
                && auth.authorize(
                        pending.secret(),
                        Integer.parseInt(code));

        if (!valid) {
            events.record("MFA_FAILED", "failed", username);
            throw new InvalidMfa();
        }

        UserMfa record = mfaRepo.findByUser(user)
                .orElseGet(UserMfa::new);

        record.setUser(user);
        record.setSecret(pending.secret());
        record.setActive(true);

        mfaRepo.save(record);
        sessions.deleteByUser(user);
        enrollments.remove(username);
    }

    public boolean isMfaRequired(User user) {
        boolean enabled = configs.findById(1L)
                .map(config -> config.isMfaEnabled())
                .orElse(true);

        return enabled && isMfaActive(user);
    }
}