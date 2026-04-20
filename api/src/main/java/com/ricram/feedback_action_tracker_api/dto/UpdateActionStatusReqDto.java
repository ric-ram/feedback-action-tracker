package com.ricram.feedback_action_tracker_api.dto;

import com.ricram.feedback_action_tracker_api.entity.ActionStatus;
import jakarta.validation.constraints.NotNull;

public record UpdateActionStatusReqDto(
        @NotNull
        ActionStatus status
) {
}
