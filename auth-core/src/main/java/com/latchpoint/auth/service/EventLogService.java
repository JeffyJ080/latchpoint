package com.latchpoint.auth.service;

import com.latchpoint.auth.model.AuthEvent;
import com.latchpoint.auth.repository.AuthEventRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class EventLogService {

    private final AuthEventRepository repo;

    public EventLogService(AuthEventRepository r) {
        this.repo = r;
    }

    // 1. Overload without IP or Request (prevents null ambiguity!)
    public void record(String type, String status, String username) {
        record(type, status, username, (String) null);
    }

    // 2. Overload with IP String
    public void record(String type, String status, String username, String ip) {
        AuthEvent e = new AuthEvent();
        e.setEventType(type);
        e.setDetails(status + (username != null ? " | user=" + username : ""));
        e.setIpAddress(ip);
        e.setTimestamp(Instant.now());
        repo.save(e);
    }

    // 3. Overload with HttpServletRequest
    public void record(String type, String status, String username, HttpServletRequest req) {
        record(type, status, username, req == null ? (String) null : req.getRemoteAddr());
    }
}