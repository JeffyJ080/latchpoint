package com.latchpoint.auth.security;

import com.latchpoint.auth.model.User;
import com.latchpoint.auth.repository.SessionRepository;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Instant;
import java.util.List;

@Component
public class AuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwt;
    private final SessionRepository sessions;

    public AuthenticationFilter(JwtService j, SessionRepository s) {
        this.jwt = j;
        this.sessions = s;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain)
            throws ServletException, IOException {
        String h = req.getHeader("Authorization");
        if (h != null && h.startsWith("Bearer ")) {
            try {
                String t = h.substring(7);
                var c = jwt.parse(t);
                var s = sessions.findById(c.getId()).orElseThrow();
                if (s.getExpiresAt().isAfter(Instant.now())) {
                    var role = s.getUser().getRole();
                    var authorities = List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
                    SecurityContextHolder.getContext().setAuthentication(
                            new UsernamePasswordAuthenticationToken(c.getSubject(), null, authorities));
                }
            } catch (Exception ignored) {
            }
        }
        chain.doFilter(req, res);
    }
}