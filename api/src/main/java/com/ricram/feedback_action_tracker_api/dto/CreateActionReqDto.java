package com.ricram.feedback_action_tracker_api.dto;

import com.ricram.feedback_action_tracker_api.entity.ActionStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateActionReqDto(
        @NotBlank
        @Size(max = 255, message = "Title should not contain more than 255 characters")
        String title,

        String description,

        @NotNull
        ActionStatus status
) {
}
