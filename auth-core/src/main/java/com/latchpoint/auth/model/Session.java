package com.latchpoint.auth.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity @Table(name="sessions", indexes=@Index(name="idx_session_jti", columnList="jti", unique=true))
public class Session {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @Column(nullable=false, unique=true, length=80) private String jti;
    @ManyToOne(fetch=FetchType.LAZY, optional=false) private User user;
    @Column(nullable=false) private Instant createdAt;
    @Column(nullable=false) private Instant expiresAt;
    @Column(nullable=false) private boolean revoked;
    public Long getId(){return id;} public String getJti(){return jti;} public void setJti(String v){jti=v;}
    public User getUser(){return user;} public void setUser(User v){user=v;} public Instant getCreatedAt(){return createdAt;} public void setCreatedAt(Instant v){createdAt=v;}
    public Instant getExpiresAt(){return expiresAt;} public void setExpiresAt(Instant v){expiresAt=v;} public boolean isRevoked(){return revoked;} public void setRevoked(boolean v){revoked=v;}
}
