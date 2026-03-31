package com.ricram.feedback_action_tracker_api.service.impl;

import com.ricram.feedback_action_tracker_api.dto.ActionRespDto;
import com.ricram.feedback_action_tracker_api.dto.CreateActionReqDto;
import com.ricram.feedback_action_tracker_api.entity.Action;
import com.ricram.feedback_action_tracker_api.entity.Feedback;
import com.ricram.feedback_action_tracker_api.repository.ActionRepository;
import com.ricram.feedback_action_tracker_api.repository.FeedbackRepository;
import com.ricram.feedback_action_tracker_api.service.ActionService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.micrometer.observation.autoconfigure.ObservationProperties;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ActionServiceImpl implements ActionService {

    private final FeedbackRepository feedbackRepository;

    private final ActionRepository actionRepository;

    private ActionRespDto toRespDto(Action action) {
        return new ActionRespDto(
                action.getId(),
                action.getTitle(),
                action.getDescription(),
                action.getStatus(),
                action.getCreatedAt(),
                action.getUpdatedAt()
        );
    }

    @Override
    public ActionRespDto createActionForFeedback(UUID feedbackId, CreateActionReqDto actionReqDto) {
        Feedback currentFeedback = feedbackRepository.findById(feedbackId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "feedback not found"));

        Action newAction = Action.builder()
                .feedback(currentFeedback)
                .title(actionReqDto.title())
                .description(actionReqDto.description())
                .status(actionReqDto.status())
                .build();

        Action savedAction = actionRepository.save(newAction);
        return toRespDto(savedAction);
    }

    @Override
    public ActionRespDto getActionById(UUID actionId) {
        return null;
    }

    @Override
    public List<ActionRespDto> listActionsForFeedback(UUID feedbackId) {
        return List.of();
    }
}
