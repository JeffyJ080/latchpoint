package com.latchpoint.auth.security;
import com.latchpoint.auth.config.AppProperties; import io.jsonwebtoken.*; import io.jsonwebtoken.security.Keys; import org.springframework.stereotype.Service; import javax.crypto.SecretKey; import java.time.Instant; import java.util.Date; import java.util.UUID;
@Service public class JwtService {
 private final AppProperties p; public JwtService(AppProperties p){this.p=p;}
 private SecretKey key(){return Keys.hmacShaKeyFor(p.getJwt().getSecret().getBytes(java.nio.charset.StandardCharsets.UTF_8));}
 public String create(String username,String jti,Instant expires){return Jwts.builder().subject(username).id(jti).issuedAt(new Date()).expiration(Date.from(expires)).signWith(key()).compact();}
 public Claims parse(String token){return Jwts.parser().verifyWith(key()).build().parseSignedClaims(token).getPayload();}
 public String username(String token){return parse(token).getSubject();} public String jti(String token){return parse(token).getId();}
}
