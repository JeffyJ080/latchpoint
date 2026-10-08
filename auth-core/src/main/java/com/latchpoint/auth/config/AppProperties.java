package com.latchpoint.auth.config;
import org.springframework.boot.context.properties.ConfigurationProperties;
@ConfigurationProperties(prefix="latchpoint")
public class AppProperties {
 public Jwt jwt=new Jwt(); public Session session=new Session(); public Mfa mfa=new Mfa(); public RateLimit rateLimit=new RateLimit(); public Seed seed=new Seed(); public String adapterEndpoint;
 public static class Jwt{public String secret; public long expiryMinutes=30; public String getSecret(){return secret;} public void setSecret(String v){secret=v;} public long getExpiryMinutes(){return expiryMinutes;} public void setExpiryMinutes(long v){expiryMinutes=v;}}
 public static class Session{public long timeoutMinutes=30; public long getTimeoutMinutes(){return timeoutMinutes;} public void setTimeoutMinutes(long v){timeoutMinutes=v;}}
 public static class Mfa{public long challengeMinutes=5; public long getChallengeMinutes(){return challengeMinutes;} public void setChallengeMinutes(long v){challengeMinutes=v;}}
 public static class RateLimit{public int maxFailures=5; public long blockMinutes=15; public int getMaxFailures(){return maxFailures;} public void setMaxFailures(int v){maxFailures=v;} public long getBlockMinutes(){return blockMinutes;} public void setBlockMinutes(long v){blockMinutes=v;}}
 public static class Seed{public boolean enabled; public String username; public String password; public boolean isEnabled(){return enabled;} public void setEnabled(boolean v){enabled=v;} public String getUsername(){return username;} public void setUsername(String v){username=v;} public String getPassword(){return password;} public void setPassword(String v){password=v;}}
 public Jwt getJwt(){return jwt;} public Session getSession(){return session;} public Mfa getMfa(){return mfa;} public RateLimit getRateLimit(){return rateLimit;} public Seed getSeed(){return seed;} public String getAdapterEndpoint(){return adapterEndpoint;} public void setAdapterEndpoint(String v){adapterEndpoint=v;}
}
