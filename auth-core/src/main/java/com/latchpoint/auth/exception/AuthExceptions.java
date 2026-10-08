package com.latchpoint.auth.exception;
public final class AuthExceptions {private AuthExceptions(){}
 public static class InvalidCredentials extends RuntimeException{}
 public static class InvalidMfa extends RuntimeException{}
 public static class InvalidSession extends RuntimeException{}
 public static class TooManyAttempts extends RuntimeException{}
 public static class InvalidConfiguration extends RuntimeException{public InvalidConfiguration(String m){super(m);}}
}
