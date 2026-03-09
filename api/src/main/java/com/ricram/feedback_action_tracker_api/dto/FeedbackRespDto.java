package com.ricram.feedback_action_tracker_api.dto;

import lombok.EqualsAndHashCode;

import java.time.Instant;
import java.util.UUID;

public record FeedbackRespDto(
        UUID id,
        String title,
        String description,
        String source,
        Instant createdAt,
        Instant updatedAT
) {
}
