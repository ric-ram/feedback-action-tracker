package com.ricram.feedback_action_tracker_api.service;

import com.ricram.feedback_action_tracker_api.dto.ActionRespDto;
import com.ricram.feedback_action_tracker_api.dto.CreateActionReqDto;

import java.util.List;
import java.util.UUID;

/**
 * Defines action-related business operations
 */
public interface ActionService {
    /**
     * Creates a new action for a specific feedback
     *
     * @param feedbackId feedback ID of the owner of the actions
     * @param actionReqDto payload containing the action information
     * @return the recently created action
     */
    ActionRespDto createActionForFeedback(UUID feedbackId, CreateActionReqDto actionReqDto);

    /**
     * Retrieves the acton based on it's id
     *
     * @param feedbackId the feedback id the action belongs to
     * @param actionId the action id
     * @return action details
     */
    ActionRespDto getActionById(UUID feedbackId, UUID actionId);

    /**
     * List all actions belonging to a feedback
     * @param feedbackId feedback ID of the owner of the actions
     * @return a list containinhg all the actions belonging to said feedback
     */
    List<ActionRespDto> listActionsForFeedback(UUID feedbackId);
}
