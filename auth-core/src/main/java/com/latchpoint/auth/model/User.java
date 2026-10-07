package com.latchpoint.auth.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity @Table(name="users")
public class User {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @Column(nullable=false, unique=true, length=100) private String username;
    @Column(nullable=false, length=255) private String passwordHash;
    @Column(nullable=false) private boolean mfaEnabled;
    @Column(length=64) private String mfaSecret;
    @Column(nullable=false) private boolean enabled = true;
    @Column(nullable=false) private int failedLoginAttempts;
    private Instant lockedUntil;
    @Column(nullable=false) private Instant createdAt;
    @Column(nullable=false) private Instant updatedAt;
    @PrePersist void prePersist(){ createdAt=Instant.now(); updatedAt=createdAt; }
    @PreUpdate void preUpdate(){ updatedAt=Instant.now(); }
    public Long getId(){return id;} public String getUsername(){return username;} public void setUsername(String v){username=v;}
    public String getPasswordHash(){return passwordHash;} public void setPasswordHash(String v){passwordHash=v;}
    public boolean isMfaEnabled(){return mfaEnabled;} public void setMfaEnabled(boolean v){mfaEnabled=v;}
    public String getMfaSecret(){return mfaSecret;} public void setMfaSecret(String v){mfaSecret=v;}
    public boolean isEnabled(){return enabled;} public void setEnabled(boolean v){enabled=v;}
    public int getFailedLoginAttempts(){return failedLoginAttempts;} public void setFailedLoginAttempts(int v){failedLoginAttempts=v;}
    public Instant getLockedUntil(){return lockedUntil;} public void setLockedUntil(Instant v){lockedUntil=v;}
}
