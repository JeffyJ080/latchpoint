package com.latchpoint.auth.repository;
import com.latchpoint.auth.model.Session; import org.springframework.data.jpa.repository.JpaRepository; import java.util.Optional;
public interface SessionRepository extends JpaRepository<Session,Long>{ Optional<Session> findByJti(String jti); }
