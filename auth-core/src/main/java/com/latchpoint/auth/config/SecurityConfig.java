package com.latchpoint.auth.config;
import com.latchpoint.auth.security.AuthenticationFilter; import org.springframework.boot.context.properties.EnableConfigurationProperties; import org.springframework.context.annotation.*; import org.springframework.security.config.annotation.web.builders.HttpSecurity; import org.springframework.security.config.http.SessionCreationPolicy; import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder; import org.springframework.security.crypto.password.PasswordEncoder; import org.springframework.security.web.SecurityFilterChain; import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
@Configuration @EnableConfigurationProperties(AppProperties.class)
public class SecurityConfig {
 @Bean PasswordEncoder passwordEncoder(){return new BCryptPasswordEncoder();}
 @Bean SecurityFilterChain securityFilterChain(HttpSecurity http, AuthenticationFilter filter) throws Exception { return http.csrf(c->c.disable()).sessionManagement(s->s.sessionCreationPolicy(SessionCreationPolicy.STATELESS)).authorizeHttpRequests(a->a.requestMatchers("/login","/verify-mfa","/session/validate","/logout","/actuator/health").permitAll().requestMatchers("/management/**").authenticated().anyRequest().authenticated()).addFilterBefore(filter,UsernamePasswordAuthenticationFilter.class).build(); }
}
