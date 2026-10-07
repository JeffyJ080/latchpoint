package com.latchpoint.auth.service;
import com.latchpoint.auth.model.AuthEvent; import com.latchpoint.auth.repository.AuthEventRepository; import jakarta.servlet.http.HttpServletRequest; import org.springframework.stereotype.Service; import java.time.Instant;
@Service public class EventLogService { private final AuthEventRepository repo; public EventLogService(AuthEventRepository r){repo=r;}
 public void record(String type,String status,String username,String ip){AuthEvent e=new AuthEvent();e.setEventType(type);e.setStatus(status);e.setUsername(username);e.setIpAddress(ip);e.setTimestamp(Instant.now());repo.save(e);}
 public void record(String type,String status,String username,HttpServletRequest req){record(type,status,username,req==null?null:req.getRemoteAddr());}
}
