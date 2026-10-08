package com.latchpoint.auth.model;

import jakarta.persistence.*;

@Entity @Table(name="framework_configuration")
public class FrameworkConfiguration {
    @Id private Long id = 1L;
    @Column(nullable=false) private boolean mfaEnabled = true;
    @Column(nullable=false) private int minLength = 8;
    @Column(nullable=false) private boolean requireSymbol = true;
    @Column(nullable=false) private int expiryDays = 90;
    @Column(nullable=false) private int sessionTimeoutMinutes = 30;
    public Long getId(){return id;} public boolean isMfaEnabled(){return mfaEnabled;} public void setMfaEnabled(boolean v){mfaEnabled=v;}
    public int getMinLength(){return minLength;} public void setMinLength(int v){minLength=v;} public boolean isRequireSymbol(){return requireSymbol;} public void setRequireSymbol(boolean v){requireSymbol=v;}
    public int getExpiryDays(){return expiryDays;} public void setExpiryDays(int v){expiryDays=v;} public int getSessionTimeoutMinutes(){return sessionTimeoutMinutes;} public void setSessionTimeoutMinutes(int v){sessionTimeoutMinutes=v;}
}
