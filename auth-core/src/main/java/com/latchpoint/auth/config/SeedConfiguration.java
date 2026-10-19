package com.latchpoint.auth.config;

import com.latchpoint.auth.model.FrameworkConfiguration;
import com.latchpoint.auth.model.User;
import com.latchpoint.auth.repository.ConfigurationRepository;
import com.latchpoint.auth.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class SeedConfiguration {

    @Bean
    CommandLineRunner seed(UserRepository users, ConfigurationRepository configurations,
            PasswordEncoder encoder, AppProperties properties) {
        return args -> {
            if (!configurations.existsById(1L)) {
                configurations.save(new FrameworkConfiguration());
            }
            if (!properties.getSeed().isEnabled() || properties.getSeed().getPassword() == null
                    || properties.getSeed().getPassword().isBlank() || properties.getSeed().getUsername() == null
                    || users.findByUsername(properties.getSeed().getUsername()).isPresent()) {
                return;
            }
            User user = new User();
            user.setUsername(properties.getSeed().getUsername());
            user.setPasswordHash(encoder.encode(properties.getSeed().getPassword()));
            user.setEmail(properties.getSeed().getUsername() + "@latchpoint.local");
            user.setEnabled(true);
            user.setRole("admin".equalsIgnoreCase(user.getUsername()) ? User.Role.ADMIN : User.Role.END_USER);
            users.save(user);
        };
    }
}