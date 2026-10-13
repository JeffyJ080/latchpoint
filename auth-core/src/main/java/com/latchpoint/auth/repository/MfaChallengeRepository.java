package com.latchpoint.auth.repository;

import com.latchpoint.auth.model.UserMfa;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface MfaChallengeRepository extends JpaRepository<UserMfa, Long> {
    Optional<UserMfa> findByChallengeId(String id);
}
