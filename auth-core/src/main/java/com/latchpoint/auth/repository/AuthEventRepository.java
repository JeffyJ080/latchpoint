package com.latchpoint.auth.repository;
import com.latchpoint.auth.model.AuthEvent; import org.springframework.data.jpa.repository.*; import java.time.Instant; import java.util.*;
public interface AuthEventRepository extends JpaRepository<AuthEvent,Long>{
 long countByEventTypeAndTimestampBetween(String eventType, Instant from, Instant to);
 List<AuthEvent> findByStatusAndTimestampBetweenOrderByTimestampDesc(String status, Instant from, Instant to);
 List<AuthEvent> findByTimestampBetweenOrderByTimestampDesc(Instant from, Instant to);
 long countByEventTypeAndTimestampAfter(String eventType, Instant after);
 long countByEventTypeAndUsernameAndTimestampAfter(String eventType,String username,Instant after);
}
