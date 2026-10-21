package com.latchpoint.auth.service;

import com.latchpoint.auth.config.AppProperties;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.time.Duration;
import java.util.Map;

@Service
public class AdapterHealthService {

    private final AppProperties props;
    private final RestClient client;

    public AdapterHealthService(AppProperties props) {
        this.props = props;

        var factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(Duration.ofSeconds(1));
        factory.setReadTimeout(Duration.ofSeconds(1));

        this.client = RestClient.builder()
                .requestFactory(factory)
                .build();
    }

    public boolean isConnected() {
        String endpoint = props.getAdapterEndpoint();

        if (endpoint == null || endpoint.isBlank()) {
            return false;
        }

        String url = endpoint.replaceAll("/+$", "")
                + "/actuator/health";

        try {
            Map<?, ?> response = client.get()
                    .uri(url)
                    .retrieve()
                    .body(Map.class);

            return response != null &&
                    "UP".equals(response.get("status"));
        } catch (RuntimeException exception) {
            return false;
        }
    }
}