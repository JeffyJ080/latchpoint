package com.latchpoint.auth.repository;

import com.latchpoint.auth.model.Session;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SessionRepository extends JpaRepository<Session, String> {

    @Override
    @EntityGraph(attributePaths = "user")
    Optional<Session> findById(String id);

    Optional<Session> findByJti(String jti);
}