package com.latchpoint.auth.exception;
import com.latchpoint.auth.dto.Responses.ErrorResponse; import jakarta.validation.ConstraintViolationException; import org.springframework.http.*; import org.springframework.web.bind.MethodArgumentNotValidException; import org.springframework.web.bind.annotation.*;
@RestControllerAdvice public class GlobalExceptionHandler {
 @ExceptionHandler(AuthExceptions.InvalidCredentials.class) ResponseEntity<ErrorResponse> credentials(){return ResponseEntity.status(401).body(new ErrorResponse("invalid_credentials"));}
 @ExceptionHandler(AuthExceptions.InvalidMfa.class) ResponseEntity<ErrorResponse> mfa(){return ResponseEntity.status(401).body(new ErrorResponse("invalid_mfa_code"));}
 @ExceptionHandler(AuthExceptions.InvalidSession.class) ResponseEntity<ErrorResponse> session(){return ResponseEntity.status(401).body(new ErrorResponse("invalid_session"));}
 @ExceptionHandler(AuthExceptions.TooManyAttempts.class) ResponseEntity<ErrorResponse> rate(){return ResponseEntity.status(429).body(new ErrorResponse("too_many_attempts"));}
 @ExceptionHandler(AuthExceptions.InvalidConfiguration.class) ResponseEntity<ErrorResponse> config(AuthExceptions.InvalidConfiguration e){return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));}
 @ExceptionHandler({MethodArgumentNotValidException.class,ConstraintViolationException.class}) ResponseEntity<ErrorResponse> validation(){return ResponseEntity.badRequest().body(new ErrorResponse("invalid_request"));}
 @ExceptionHandler(Exception.class) ResponseEntity<ErrorResponse> other(){return ResponseEntity.status(500).body(new ErrorResponse("internal_error"));}
}
