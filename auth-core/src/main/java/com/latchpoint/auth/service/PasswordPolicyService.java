package com.latchpoint.auth.service;

import com.latchpoint.auth.exception.AuthExceptions.InvalidConfiguration;
import com.latchpoint.auth.model.FrameworkConfiguration;
import org.springframework.stereotype.Service;

@Service
public class PasswordPolicyService {

    public void validate(String password, FrameworkConfiguration config) {
        if (password == null ||
                password.length() < config.getMinLength()) {
            reject();
        }

        if (config.isRequireUppercase() &&
                password.codePoints().noneMatch(Character::isUpperCase)) {
            reject();
        }

        if (config.isRequireNumber() &&
                password.codePoints().noneMatch(Character::isDigit)) {
            reject();
        }

        if (config.isRequireSymbol() &&
                password.codePoints().noneMatch(character -> !Character.isLetterOrDigit(character) &&
                        !Character.isWhitespace(character))) {
            reject();
        }
    }

    private void reject() {
        throw new InvalidConfiguration("password_policy_violation");
    }
}