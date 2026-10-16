package com.latchpoint.auth.service;

import com.latchpoint.auth.config.AppProperties;
import com.latchpoint.auth.exception.AuthExceptions.InvalidMfa;
import com.latchpoint.auth.model.User;
import com.latchpoint.auth.model.UserMfa;
import com.latchpoint.auth.repository.UserMfaRepository;
import com.warrenstrange.googleauth.GoogleAuthenticator;
import org.springframework.stereotype.Service;

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

    public MfaService(UserMfaRepository r, AppProperties p, EventLogService e) {
        this.mfaRepo = r;
        this.props = p;
        this.events = e;
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

    public User verify(String challengeId, String code) {
        PendingChallenge challenge = challenges.get(challengeId);
        if (challenge == null || challenge.expiresAt().isBefore(Instant.now())) {
            challenges.remove(challengeId);
            throw new InvalidMfa();
        }

        UserMfa userMfa = mfaRepo.findByUser(challenge.user()).orElseThrow(InvalidMfa::new);
        try {
            int otp = Integer.parseInt(code);
            if (!auth.authorize(userMfa.getSecret(), otp)) {
                throw new InvalidMfa();
            }
        } catch (NumberFormatException e) {
            throw new InvalidMfa();
        }

        challenges.remove(challengeId);
        events.record("MFA_SUCCESS", "success", challenge.user().getUsername());
        return challenge.user();
    }
}