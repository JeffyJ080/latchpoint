package com.latchpoint.adapter;

import com.github.tomakehurst.wiremock.WireMockServer;
import com.github.tomakehurst.wiremock.client.WireMock;
import com.github.tomakehurst.wiremock.core.WireMockConfiguration;
import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import static com.github.tomakehurst.wiremock.client.WireMock.aResponse;
import static com.github.tomakehurst.wiremock.client.WireMock.urlEqualTo;

@SpringBootTest
@AutoConfigureMockMvc
public class LegacyAuthControllerTest {

    private static WireMockServer wireMockServer;

    @Autowired
    private MockMvc mockMvc;

    @BeforeAll
    static void startWireMock() {
        // Start simulated Auth Core server on dynamic port
        wireMockServer = new WireMockServer(WireMockConfiguration.wireMockConfig().dynamicPort());
        wireMockServer.start();
        WireMock.configureFor("localhost", wireMockServer.port());
    }

    @AfterAll
    static void stopWireMock() {
        if (wireMockServer != null) {
            wireMockServer.stop();
        }
    }

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("auth-core.base-url", () -> "http://localhost:" + wireMockServer.port());
    }

    @BeforeEach
    void resetWireMock() {
        wireMockServer.resetAll();
    }

    @Test
    void testLegacyLoginSuccess_SetsSessionCookie() throws Exception {
        // 1. Mock Auth Core returning 200 OK with sessionToken
        wireMockServer.stubFor(WireMock.post(urlEqualTo("/login"))
                .willReturn(aResponse()
                        .withHeader("Content-Type", "application/json")
                        .withStatus(200)
                        .withBody("""
                                {
                                  "sessionToken": "jwt-token-xyz-123",
                                  "expiresAt": "2026-09-29T12:00:00Z"
                                }
                                """)));

        // 2. Simulate legacy HTML form submission
        mockMvc.perform(MockMvcRequestBuilders.post("/api/v1/legacy/login")
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .param("username", "testuser")
                .param("password", "SecurePass123!"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.cookie().exists("LATCHPOINT_SESSION"))
                .andExpect(MockMvcResultMatchers.cookie().value("LATCHPOINT_SESSION", "jwt-token-xyz-123"))
                .andExpect(MockMvcResultMatchers.cookie().httpOnly("LATCHPOINT_SESSION", true));
    }

    @Test
    void testLegacyLogin_MfaRequired_DoesNotSetCookie() throws Exception {
        // Mock Auth Core requesting MFA
        wireMockServer.stubFor(WireMock.post(urlEqualTo("/login"))
                .willReturn(aResponse()
                        .withHeader("Content-Type", "application/json")
                        .withStatus(200)
                        .withBody("""
                                {
                                  "mfaRequired": true,
                                  "mfaChallengeId": "challenge-999"
                                }
                                """)));

        mockMvc.perform(MockMvcRequestBuilders.post("/api/v1/legacy/login")
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .param("username", "testuser")
                .param("password", "SecurePass123!"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.mfaRequired").value(true))
                .andExpect(MockMvcResultMatchers.jsonPath("$.mfaChallengeId").value("challenge-999"))
                .andExpect(MockMvcResultMatchers.cookie().doesNotExist("LATCHPOINT_SESSION"));
    }

    @Test
    void testLegacyLogin_InvalidCredentials_Returns401() throws Exception {
        // Mock Auth Core 401 Unauthorized
        wireMockServer.stubFor(WireMock.post(urlEqualTo("/login"))
                .willReturn(aResponse()
                        .withHeader("Content-Type", "application/json")
                        .withStatus(401)
                        .withBody("""
                                { "error": "invalid_credentials" }
                                """)));

        mockMvc.perform(MockMvcRequestBuilders.post("/api/v1/legacy/login")
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .param("username", "baduser")
                .param("password", "wrongpass"))
                .andExpect(MockMvcResultMatchers.status().isUnauthorized())
                .andExpect(MockMvcResultMatchers.jsonPath("$.error").value("auth_error"));
    }

    @Test
    void testCheckSession_WithValidCookie_Returns200() throws Exception {
        // Mock Auth Core session validation
        wireMockServer.stubFor(WireMock.post(urlEqualTo("/session/validate"))
                .willReturn(aResponse()
                        .withHeader("Content-Type", "application/json")
                        .withStatus(200)
                        .withBody("""
                                {
                                  "valid": true,
                                  "username": "testuser",
                                  "expiresAt": "2026-09-29T12:00:00Z"
                                }
                                """)));

        mockMvc.perform(MockMvcRequestBuilders.get("/api/v1/legacy/check-session")
                .cookie(new Cookie("LATCHPOINT_SESSION", "jwt-token-xyz-123")))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.valid").value(true))
                .andExpect(MockMvcResultMatchers.jsonPath("$.username").value("testuser"));
    }
}