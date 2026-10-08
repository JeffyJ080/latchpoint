package com.latchpoint.auth.controller;
import com.latchpoint.auth.dto.Requests.*; import com.latchpoint.auth.dto.Responses.*; import com.latchpoint.auth.service.*; import jakarta.servlet.http.HttpServletRequest; import jakarta.validation.Valid; import org.springframework.http.ResponseEntity; import org.springframework.web.bind.annotation.*;
@RestController public class AuthController {private final AuthenticationService auth;private final SessionService sessions;public AuthController(AuthenticationService a,SessionService s){auth=a;sessions=s;}
 @PostMapping("/login") public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest r,HttpServletRequest req){return ResponseEntity.ok(auth.login(r.username(),r.password(),req));}
 @PostMapping("/verify-mfa") public ResponseEntity<LoginResponse> mfa(@Valid @RequestBody MfaVerifyRequest r){return ResponseEntity.ok(auth.verifyMfa(r.mfaChallengeId(),r.code()));}
 @PostMapping("/session/validate") public ResponseEntity<SessionValidateResponse> validate(@Valid @RequestBody SessionValidateRequest r){try{var s=sessions.validate(r.sessionToken());return ResponseEntity.ok(new SessionValidateResponse(true,s.getUser().getUsername(),s.getExpiresAt().toString()));}catch(Exception e){return ResponseEntity.ok(new SessionValidateResponse(false,null,null));}}
 @PostMapping("/logout") public ResponseEntity<Void> logout(@Valid @RequestBody SessionValidateRequest r){sessions.invalidate(r.sessionToken());return ResponseEntity.noContent().build();}
}
