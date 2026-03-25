package com.ricram.feedback_action_tracker_api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateFeedbackReqDto (

    @NotBlank
    @Size(max = 255, message = "Title should not contain more than 255 characters")
    String title,

    String description,

    @Size(max = 55, message = "Source should not contain more than 55 characters")
    String source
    ){}
