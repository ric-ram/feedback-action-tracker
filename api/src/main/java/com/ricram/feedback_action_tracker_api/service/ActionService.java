package com.ricram.feedback_action_tracker_api.service;

import com.ricram.feedback_action_tracker_api.dto.ActionRespDto;
import com.ricram.feedback_action_tracker_api.dto.CreateActionReqDto;
import com.ricram.feedback_action_tracker_api.dto.UpdateActionStatusReqDto;
import com.ricram.feedback_action_tracker_api.entity.ActionStatus;

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
     *
     * @param feedbackId feedback ID of the owner of the actions
     * @return a list containing all the actions belonging to said feedback
     */
    List<ActionRespDto> listActionsForFeedback(UUID feedbackId);

    /**
     * Updates the status of an action
     *
     * @param feedbackId feedback ID of the owner of the action
     * @param actionId the action ID
     * @param actionStatus the new status of the action
     * @return the updated action
     */
    ActionRespDto updateActionStatus(UUID feedbackId, UUID actionId, UpdateActionStatusReqDto actionStatus);
}
