package com.latchpoint.auth.dto;
import java.util.*;
public final class Responses { private Responses(){}
 public record LoginResponse(String sessionToken,String expiresAt,Boolean mfaRequired,String mfaChallengeId){ public static LoginResponse session(String t,String e){return new LoginResponse(t,e,null,null);} public static LoginResponse mfa(String id){return new LoginResponse(null,null,true,id);} }
 public record SessionValidateResponse(boolean valid,String username,String expiresAt){}
 public record DashboardResponse(String authStatus, RecentLogins recentLogins, boolean mfaEnabled,String legacyConnectionStatus){}
 public record RecentLogins(long success,long failed){}
 public record EventResponse(String id,String timestamp,String username,String status,String ipAddress){}
 public record EventsResponse(List<EventResponse> events){}
 public record PasswordPolicy(int minLength,boolean requireSymbol,int expiryDays){}
 public record AdapterConnection(String endpoint,String status){}
 public record ConfigResponse(boolean mfaEnabled,PasswordPolicy passwordPolicy,int sessionTimeoutMinutes,AdapterConnection adapterConnection){}
 public record ConfigRequest(boolean mfaEnabled,PasswordPolicy passwordPolicy,int sessionTimeoutMinutes,AdapterConnection adapterConnection){}
 public record AlertResponse(String id,String type,String message,String timestamp){}
 public record AlertsResponse(List<AlertResponse> alerts){}
 public record ErrorResponse(String error){}
}
