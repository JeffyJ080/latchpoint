package com.latchpoint.auth.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity @Table(name="mfa_challenges", indexes=@Index(name="idx_mfa_challenge_id", columnList="challengeId", unique=true))
public class MfaChallenge {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @Column(nullable=false, unique=true, length=80) private String challengeId;
    @ManyToOne(fetch=FetchType.LAZY, optional=false) private User user;
    @Column(nullable=false) private Instant expiresAt;
    @Column(nullable=false) private boolean used;
    public Long getId(){return id;} public String getChallengeId(){return challengeId;} public void setChallengeId(String v){challengeId=v;}
    public User getUser(){return user;} public void setUser(User v){user=v;} public Instant getExpiresAt(){return expiresAt;} public void setExpiresAt(Instant v){expiresAt=v;}
    public boolean isUsed(){return used;} public void setUsed(boolean v){used=v;}
}
