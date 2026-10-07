package com.latchpoint.auth.model;

import jakarta.persistence.*;

@Entity
@Table(name = "configurations")
public class FrameworkConfiguration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "config_id")
    private Long id = 1L;

    @Column(name = "password_min_length", nullable = false)
    private int minLength = 8;

    @Column(name = "require_uppercase", nullable = false)
    private boolean requireUppercase = true;

    @Column(name = "require_number", nullable = false)
    private boolean requireNumber = true;

    @Column(name = "require_symbol", nullable = false)
    private boolean requireSymbol = true;

    @Column(name = "password_expiry_days", nullable = false)
    private int expiryDays = 90;

    @Column(name = "mfa_enabled", nullable = false)
    private boolean mfaEnabled = true;

    @Column(name = "force_mfa", nullable = false)
    private boolean forceMfa = false;

    @Column(name = "session_timeout_limit", nullable = false)
    private int sessionTimeoutMinutes = 30;

    public Long getId() {
        return id;
    }

    public int getMinLength() {
        return minLength;
    }

    public void setMinLength(int minLength) {
        this.minLength = minLength;
    }

    public boolean isRequireUppercase() {
        return requireUppercase;
    }

    public void setRequireUppercase(boolean requireUppercase) {
        this.requireUppercase = requireUppercase;
    }

    public boolean isRequireNumber() {
        return requireNumber;
    }

    public void setRequireNumber(boolean requireNumber) {
        this.requireNumber = requireNumber;
    }

    public boolean isRequireSymbol() {
        return requireSymbol;
    }

    public void setRequireSymbol(boolean requireSymbol) {
        this.requireSymbol = requireSymbol;
    }

    public int getExpiryDays() {
        return expiryDays;
    }

    public void setExpiryDays(int expiryDays) {
        this.expiryDays = expiryDays;
    }

    public boolean isMfaEnabled() {
        return mfaEnabled;
    }

    public void setMfaEnabled(boolean mfaEnabled) {
        this.mfaEnabled = mfaEnabled;
    }

    public boolean isForceMfa() {
        return forceMfa;
    }

    public void setForceMfa(boolean forceMfa) {
        this.forceMfa = forceMfa;
    }

    public int getSessionTimeoutMinutes() {
        return sessionTimeoutMinutes;
    }

    public void setSessionTimeoutMinutes(int sessionTimeoutMinutes) {
        this.sessionTimeoutMinutes = sessionTimeoutMinutes;
    }
}
