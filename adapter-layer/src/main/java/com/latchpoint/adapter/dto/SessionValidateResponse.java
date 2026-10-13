package com.latchpoint.adapter.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record SessionValidateResponse(
        boolean valid,
        String username,
        String expiresAt) {
}