package com.ricram.feedback_action_tracker_api.service.impl;

import com.ricram.feedback_action_tracker_api.dto.CreateFeedbackReqDto;
import com.ricram.feedback_action_tracker_api.dto.FeedbackRespDto;
import com.ricram.feedback_action_tracker_api.entity.Feedback;
import com.ricram.feedback_action_tracker_api.entity.Workspace;
import com.ricram.feedback_action_tracker_api.repository.FeedbackRepository;
import com.ricram.feedback_action_tracker_api.repository.WorkspaceRepository;
import com.ricram.feedback_action_tracker_api.service.FeedbackService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FeedbackServiceImpl implements FeedbackService {

    private final WorkspaceRepository workspaceRepository;

    private final FeedbackRepository feedbackRepository;

    private FeedbackRespDto toRespDto(Feedback feedback) {
        return new FeedbackRespDto(
                feedback.getId(),
                feedback.getTitle(),
                feedback.getDescription(),
                feedback.getSource(),
                feedback.getCreatedAt(),
                feedback.getUpdatedAt()
        );
    }

    @Override
    @Transactional
    public FeedbackRespDto createFeedbackForWorkspace(UUID workspaceId, CreateFeedbackReqDto feedbackReqDto) {
        Workspace currentWorkspace = workspaceRepository.findById(workspaceId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "workspace not found"));

        Feedback newFeedback = Feedback.builder()
                .workspace(currentWorkspace)
                .title(feedbackReqDto.title())
                .description(feedbackReqDto.description())
                .source(feedbackReqDto.source())
                .build();
        Feedback savedFeedback = feedbackRepository.save(newFeedback);
        return toRespDto(savedFeedback);
    }

    @Override
    @Transactional(readOnly = true)
    public FeedbackRespDto getFeedbackById(UUID feedbackId) {
        Feedback currentFeedback = feedbackRepository.findById(feedbackId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "feedback not found"));

        return toRespDto(currentFeedback);
    }

    @Override
    @Transactional(readOnly = true)
    public List<FeedbackRespDto> listFeedbackForWorkspace(UUID workspaceId) {
        if (!workspaceRepository.existsById(workspaceId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "workspace not found");
        }

        Sort sort = Sort.by(Sort.Direction.DESC, "createdAt");

        List<Feedback> feedbackList = feedbackRepository.findByWorkspaceId(workspaceId, sort);

        return feedbackList.stream().map(this::toRespDto).toList();
    }
}
