package com.latchpoint.auth.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity @Table(name="auth_events", indexes={@Index(name="idx_event_time", columnList="timestamp"),@Index(name="idx_event_status", columnList="status")})
public class AuthEvent {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @Column(name="timestamp",nullable=false) private Instant timestamp;
    @Column(length=100) private String username;
    @Column(nullable=false,length=20) private String status;
    @Column(nullable=false,length=50) private String eventType;
    @Column(length=100) private String ipAddress;
    public Long getId(){return id;} public Instant getTimestamp(){return timestamp;} public void setTimestamp(Instant v){timestamp=v;}
    public String getUsername(){return username;} public void setUsername(String v){username=v;} public String getStatus(){return status;} public void setStatus(String v){status=v;}
    public String getEventType(){return eventType;} public void setEventType(String v){eventType=v;} public String getIpAddress(){return ipAddress;} public void setIpAddress(String v){ipAddress=v;}
}
