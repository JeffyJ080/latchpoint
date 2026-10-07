package com.latchpoint.auth.controller;
import com.latchpoint.auth.dto.Responses.*; import com.latchpoint.auth.service.ManagementService; import org.springframework.format.annotation.DateTimeFormat; import org.springframework.web.bind.annotation.*; import java.time.Instant;
@RestController @RequestMapping("/management") public class ManagementController {private final ManagementService service;public ManagementController(ManagementService s){service=s;}
 @GetMapping("/dashboard") public DashboardResponse dashboard(){return service.dashboard();}
 @GetMapping("/events") public EventsResponse events(@RequestParam(required=false)String status,@RequestParam(required=false)@DateTimeFormat(iso=DateTimeFormat.ISO.DATE_TIME)Instant from,@RequestParam(required=false)@DateTimeFormat(iso=DateTimeFormat.ISO.DATE_TIME)Instant to){return service.eventList(status,from,to);}
 @GetMapping("/config") public ConfigResponse config(){return service.getConfig();}
 @PutMapping("/config") public ConfigResponse config(@jakarta.validation.Valid @RequestBody ConfigRequest request){return service.update(request);}
 @GetMapping("/alerts") public AlertsResponse alerts(){return service.alerts();}
}
