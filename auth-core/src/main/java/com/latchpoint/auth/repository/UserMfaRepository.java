package com.latchpoint.auth.repository;

    import com.latchpoint.auth.model.User;
    import com.latchpoint.auth.model.UserMfa;
    import org.springframework.data.jpa.repository.JpaRepository;
    import java.util.Optional;

    public interface UserMfaRepository extends JpaRepository<UserMfa, Long> {
        Optional<UserMfa> findByUser(User user);
        Optional<UserMfa> findByUserId(Long userId);
    }