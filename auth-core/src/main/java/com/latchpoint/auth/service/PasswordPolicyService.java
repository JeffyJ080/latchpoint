package com.latchpoint.auth.service;
import com.latchpoint.auth.exception.AuthExceptions.InvalidConfiguration; import com.latchpoint.auth.model.FrameworkConfiguration; import org.springframework.stereotype.Service;
@Service public class PasswordPolicyService {
 public void validate(String password,FrameworkConfiguration c){if(password==null||password.length()<c.getMinLength()) throw new InvalidConfiguration("password_policy_violation"); if(c.isRequireSymbol()&&!password.matches(".*[^A-Za-z0-9].*")) throw new InvalidConfiguration("password_policy_violation");}
}
