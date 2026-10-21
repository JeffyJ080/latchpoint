package com.latchpoint.auth.service;

import com.latchpoint.auth.config.AppProperties;
import com.latchpoint.auth.dto.Responses.*;
import com.latchpoint.auth.exception.AuthExceptions.InvalidConfiguration;
import com.latchpoint.auth.model.FrameworkConfiguration;
import com.latchpoint.auth.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.*;
import java.util.*;

@Service
public class ManagementService {
    private final ConfigurationRepository configs;
    private final AuthEventRepository events;
    private final AppProperties props;
    private final AdapterHealthService adapterHealth;

    public ManagementService(ConfigurationRepository c, AuthEventRepository e, AppProperties p,
            AdapterHealthService adapterHealth) {
        this.configs = c;
        this.events = e;
        this.props = p;
        this.adapterHealth = adapterHealth;
    }

    private FrameworkConfiguration config() {
        return configs.findById(1L).orElseGet(() -> configs.save(new FrameworkConfiguration()));
    }

    public DashboardResponse dashboard() {
        Instant from = Instant.now().minus(24, java.time.temporal.ChronoUnit.HOURS), now = Instant.now();
        long success = events.countByEventTypeAndTimestampBetween("LOGIN_SUCCESS", from, now),
                failed = events.countByEventTypeAndTimestampBetween("LOGIN_FAILED", from, now);
        var c = config();
        return new DashboardResponse(failed > 20 ? "at_risk" : "secure", new RecentLogins(success, failed),
                c.isMfaEnabled(),
                adapterHealth.isConnected()
                        ? "connected"
                        : "disconnected");
    }

    public EventsResponse eventList(
            String status,
            Instant from,
            Instant to) {
        String requestedStatus = status == null || status.isBlank()
                ? null
                : status.trim().toLowerCase(Locale.ROOT);

        if (requestedStatus != null &&
                !requestedStatus.equals("success") &&
                !requestedStatus.equals("failed")) {
            throw new InvalidConfiguration("invalid_event_status");
        }

        Instant end = to == null ? Instant.now() : to;
        Instant start = from == null
                ? end.minus(30, java.time.temporal.ChronoUnit.DAYS)
                : from;

        if (start.isAfter(end)) {
            throw new InvalidConfiguration("invalid_date_range");
        }

        var results = events
                .findByTimestampBetweenOrderByTimestampDesc(start, end)
                .stream()
                .map(event -> {
                    String details = event.getDetails() == null
                            ? ""
                            : event.getDetails();

                    String separator = " | user=";
                    int position = details.indexOf(separator);

                    String eventStatus = position >= 0
                            ? details.substring(0, position)
                            : details;

                    String username = position >= 0
                            ? details.substring(position + separator.length())
                            : null;

                    return new EventResponse(
                            String.valueOf(event.getId()),
                            event.getTimestamp().toString(),
                            username,
                            eventStatus,
                            event.getIpAddress());
                })
                .filter(event -> requestedStatus == null ||
                        requestedStatus.equals(event.status()))
                .toList();

        return new EventsResponse(results);
    }

    public ConfigResponse getConfig() {
        var c = config();
        return toResponse(c);
    }

    @Transactional
    public ConfigResponse update(ConfigRequest r) {
        if (r.passwordPolicy() == null || r.passwordPolicy().minLength() < 8 || r.passwordPolicy().minLength() > 128
                || r.passwordPolicy().expiryDays() < 1 || r.passwordPolicy().expiryDays() > 3650
                || r.sessionTimeoutMinutes() < 1 || r.sessionTimeoutMinutes() > 1440)
            throw new InvalidConfiguration("invalid_configuration");
        var c = config();
        c.setMfaEnabled(r.mfaEnabled());
        c.setMinLength(r.passwordPolicy().minLength());
        c.setRequireSymbol(r.passwordPolicy().requireSymbol());
        c.setExpiryDays(r.passwordPolicy().expiryDays());
        c.setSessionTimeoutMinutes(r.sessionTimeoutMinutes());
        configs.save(c);
        return toResponse(c);
    }

    private ConfigResponse toResponse(FrameworkConfiguration c) {
        return new ConfigResponse(c.isMfaEnabled(),
                new PasswordPolicy(c.getMinLength(), c.isRequireSymbol(), c.getExpiryDays()),
                c.getSessionTimeoutMinutes(),
                new AdapterConnection(props.getAdapterEndpoint(),
                        adapterHealth.isConnected()
                                ? "connected"
                                : "disconnected"));
    }

    public AlertsResponse alerts() {
        Instant now = Instant.now();

        long windowMinutes = props.getRateLimit().getBlockMinutes();
        Instant since = now.minusSeconds(windowMinutes * 60);

        List<AlertResponse> results = new ArrayList<>();

        long failures = events.countByEventTypeAndTimestampAfter(
                "LOGIN_FAILED", since)
                + events.countByEventTypeAndTimestampAfter(
                        "MFA_FAILED", since);

        if (failures >= props.getRateLimit().getMaxFailures()) {
            results.add(new AlertResponse(
                    "failed-login-spike",
                    "failed_login_spike",
                    "Multiple authentication failures detected in the last "
                            + windowMinutes + " minutes.",
                    now.toString()));
        }

        if (!adapterHealth.isConnected()) {
            results.add(new AlertResponse(
                    "adapter-disconnected",
                    "adapter_disconnect",
                    "The legacy adapter is unreachable or unhealthy.",
                    now.toString()));
        }

        return new AlertsResponse(results);
    }
}
