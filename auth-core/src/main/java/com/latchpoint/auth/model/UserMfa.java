package com.latchpoint.auth.model;

import jakarta.persistence.*;

@Entity
@Table(name = "mfa")
public class UserMfa {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "mfa_id")
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(nullable = false, length = 255)
    private String secret;

    @Column(name = "is_active", nullable = false)
    private boolean active = false;

    public Long getId() {
        return id;
    }

    public void setId(Long v) {
        id = v;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User v) {
        user = v;
    }

    public String getSecret() {
        return secret;
    }

    public void setSecret(String v) {
        secret = v;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean v) {
        active = v;
    }
}
