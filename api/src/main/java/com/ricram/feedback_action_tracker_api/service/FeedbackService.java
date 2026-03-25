package com.ricram.feedback_action_tracker_api.service;

import com.ricram.feedback_action_tracker_api.dto.CreateFeedbackReqDto;
import com.ricram.feedback_action_tracker_api.dto.FeedbackRespDto;

import java.util.List;
import java.util.UUID;

/**
 * Defines feedback-related business operations
 */
public interface FeedbackService {
    /**
     * Creates a new feedback entry for a workspace
     *
     * @param workspaceId workspace ID of the owner of the feedback
     * @param feedbackReqDto payload containing the feedback information
     * @return the recently created feedback
     */
    FeedbackRespDto createFeedbackForWorkspace(UUID workspaceId, CreateFeedbackReqDto feedbackReqDto);

    /**
     * Retrieves the feedback based on it's id
     *
     * @param feedbackId the feedback id
     * @return feedback details
     */
    FeedbackRespDto getFeedbackById(UUID feedbackId);

    /**
     * List all feedback belonging to a workspace
     *
     * @param workspaceId workspace ID of the owner of the feedback
     * @return a list containing all the feedback belonging to said workspace
     */
    List<FeedbackRespDto> listFeedbackForWorkspace(UUID workspaceId);
}
