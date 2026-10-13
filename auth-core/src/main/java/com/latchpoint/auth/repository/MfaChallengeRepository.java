package com.latchpoint.auth.repository;
import com.latchpoint.auth.model.MfaChallenge; import org.springframework.data.jpa.repository.JpaRepository; import java.util.Optional;
public interface MfaChallengeRepository extends JpaRepository<MfaChallenge,Long>{ Optional<MfaChallenge> findByChallengeId(String id); }
