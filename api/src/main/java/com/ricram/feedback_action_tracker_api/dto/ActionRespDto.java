package com.ricram.feedback_action_tracker_api.dto;

import com.ricram.feedback_action_tracker_api.entity.ActionStatus;

import java.time.Instant;
import java.util.UUID;

public record ActionRespDto(
        UUID id,
        String title,
        String description,
        ActionStatus status,
        Instant createdAt,
        Instant updatedAt
) {
}
