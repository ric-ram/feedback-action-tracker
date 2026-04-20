package com.ricram.feedback_action_tracker_api;

import com.ricram.feedback_action_tracker_api.dto.ActionRespDto;
import com.ricram.feedback_action_tracker_api.dto.CreateActionReqDto;
import com.ricram.feedback_action_tracker_api.dto.UpdateActionStatusReqDto;
import com.ricram.feedback_action_tracker_api.entity.Action;
import com.ricram.feedback_action_tracker_api.entity.ActionStatus;
import com.ricram.feedback_action_tracker_api.entity.Feedback;
import com.ricram.feedback_action_tracker_api.entity.Workspace;
import com.ricram.feedback_action_tracker_api.repository.ActionRepository;
import com.ricram.feedback_action_tracker_api.repository.FeedbackRepository;
import com.ricram.feedback_action_tracker_api.service.impl.ActionServiceImpl;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ActionServiceImplTests {

    @Mock
    private FeedbackRepository feedbackRepository;

    @Mock
    private ActionRepository actionRepository;

    @InjectMocks
    private ActionServiceImpl actionServiceImpl;

    @Test
    @DisplayName("createActionForFeedback() -> Success")
    void createActionForFeedbackSuccess() {
        UUID feedbackId = UUID.randomUUID();
        UUID actionId = UUID.randomUUID();
        UUID workspaceId = UUID.randomUUID();
        Workspace existingWorkspace = new Workspace(workspaceId,
                "test",
                Instant.parse("2026-02-28T12:00:00Z"),
                Instant.parse("2026-02-28T12:00:00Z"));

        Feedback existingFeedback = new Feedback(feedbackId,
                existingWorkspace,
                "testFeedback",
                "testing",
                "TEST",
                Instant.parse("2026-04-07T12:00:00Z"),
                Instant.parse("2026-04-07T12:00:00Z")
        );

        when(feedbackRepository.findById(feedbackId)).thenReturn(Optional.of(existingFeedback));

        ArgumentCaptor<Action> captor = ArgumentCaptor.forClass(Action.class);
        when(actionRepository.save(captor.capture()))
                .thenAnswer(invocation -> {
                    Action action = (Action) invocation.getArguments()[0];
                    action.setId(actionId);
                    action.setFeedback(existingFeedback);
                    action.setCreatedAt(Instant.parse("2026-02-28T12:00:00Z"));
                    return action;
                });
        CreateActionReqDto req = new CreateActionReqDto("task", "test action");

        ActionRespDto resp = actionServiceImpl.createActionForFeedback(feedbackId, req);

        assertEquals(actionId, resp.id());
        assertEquals("task", resp.title());
        assertEquals("test action", resp.description());
        assertEquals(ActionStatus.TODO, resp.status());

        Action savedAction = captor.getValue();
        assertEquals("task", savedAction.getTitle());
        assertEquals("test action", savedAction.getDescription());
        assertEquals(existingFeedback, savedAction.getFeedback());
        assertEquals(ActionStatus.TODO, savedAction.getStatus());
        assertNotNull(savedAction.getCreatedAt());

        verify(feedbackRepository).findById(feedbackId);
        verify(actionRepository).save(savedAction);
        verifyNoMoreInteractions(feedbackRepository, actionRepository);
    }

    @Test
    @DisplayName("createActionForFeedback() -> Feedback not found")
    void createActionForFeedbackNotFound() {
        UUID feedbackId = UUID.randomUUID();

        when(feedbackRepository.findById(feedbackId)).thenReturn(Optional.empty());

        CreateActionReqDto req = new CreateActionReqDto("task", "test action");

        ResponseStatusException ex = assertThrows(
                ResponseStatusException.class,
                () -> actionServiceImpl.createActionForFeedback(feedbackId, req)
        );

        assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
        assertTrue(ex.getMessage().contains("feedback not found"));

        verify(feedbackRepository).findById(feedbackId);
        verifyNoMoreInteractions(feedbackRepository, actionRepository);
    }

    @Test
    @DisplayName("getActionById() -> Success")
    void getActionByIdSuccess() {
        UUID feedbackId = UUID.randomUUID();
        UUID actionId = UUID.randomUUID();
        UUID workspaceId = UUID.randomUUID();
        Workspace existingWorkspace = new Workspace(
                workspaceId,
                "test",
                Instant.parse("2026-03-09T12:00:00Z"),
                Instant.parse("2026-03-09T12:00:00Z")
        );

        Feedback existingFeedback = new Feedback(
                feedbackId,
                existingWorkspace,
                "testFeedback",
                "testing",
                "TEST",
                Instant.parse("2026-03-10T12:00:00Z"),
                Instant.parse("2026-03-10T12:00:00Z")
        );

        Action existingAction = new Action(
                actionId,
                existingFeedback,
                "task",
                "testing",
                ActionStatus.TODO,
                Instant.parse("2026-04-07T12:00:00Z"),
                Instant.parse("2026-04-07T12:00:00Z")
        );

        when(actionRepository.findByFeedbackIdAndId(feedbackId, actionId)).thenReturn(Optional.of(existingAction));

        ActionRespDto resp = actionServiceImpl.getActionById(feedbackId, actionId);

        assertEquals(existingAction.getId(), resp.id());
        assertEquals(existingAction.getTitle(), resp.title());
        assertEquals(existingAction.getDescription(), resp.description());
        assertEquals(existingAction.getStatus(), resp.status());
        assertEquals(existingAction.getCreatedAt(), resp.createdAt());

        verify(actionRepository).findByFeedbackIdAndId(feedbackId, actionId);
        verifyNoMoreInteractions(actionRepository);
    }

    @Test
    @DisplayName("getActionById() -> Feedback not found")
    void getActionByIdFeedbackNotFound() {
        UUID feedbackId = UUID.randomUUID();
        UUID actionId = UUID.randomUUID();

        when(actionRepository.findByFeedbackIdAndId(feedbackId, actionId)).thenReturn(Optional.empty());

        ResponseStatusException ex = assertThrows(
                ResponseStatusException.class,
                () -> actionServiceImpl.getActionById(feedbackId, actionId)
        );

        assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
        assertTrue(ex.getMessage().contains("action not found"));

        verify(actionRepository).findByFeedbackIdAndId(feedbackId, actionId);
        verifyNoMoreInteractions(actionRepository);
    }

    @Test
    @DisplayName("getActionById() -> Feedback-action mismatch, action not found")
    void getActionByIdActionNotChildOfFeedback() {
        UUID feedbackId1 = UUID.randomUUID();
        UUID feedbackId2 = UUID.randomUUID();
        UUID actionId = UUID.randomUUID();
        UUID workspaceId = UUID.randomUUID();
        Workspace existingWorkspace = new Workspace(
                workspaceId,
                "test",
                Instant.parse("2026-03-09T12:00:00Z"),
                Instant.parse("2026-03-09T12:00:00Z")
        );

        Feedback existingFeedback1 = new Feedback(
                feedbackId1,
                existingWorkspace,
                "testFeedback",
                "testing",
                "TEST",
                Instant.parse("2026-03-10T12:00:00Z"),
                Instant.parse("2026-03-10T12:00:00Z")
        );

        Feedback existingFeedback2 = new Feedback(
                feedbackId2,
                existingWorkspace,
                "testFeedback",
                "testing",
                "TEST",
                Instant.parse("2026-03-10T12:00:00Z"),
                Instant.parse("2026-03-10T12:00:00Z")
        );

        Action existingAction = new Action(
                actionId,
                existingFeedback2,
                "task",
                "testing",
                ActionStatus.TODO,
                Instant.parse("2026-04-07T12:00:00Z"),
                Instant.parse("2026-04-07T12:00:00Z")
        );


        when(actionRepository.findByFeedbackIdAndId(feedbackId1, actionId)).thenReturn(Optional.empty());

        ResponseStatusException ex = assertThrows(
                ResponseStatusException.class,
                () -> actionServiceImpl.getActionById(feedbackId1, actionId)
        );

        assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
        assertTrue(ex.getMessage().contains("action not found"));

        verify(actionRepository).findByFeedbackIdAndId(feedbackId1, actionId);
        verifyNoMoreInteractions(actionRepository);
    }

    @Test
    @DisplayName("getActionById() -> Action not found")
    void getActionByIdActionNotFound() {
        UUID feedbackId = UUID.randomUUID();
        UUID actionId = UUID.randomUUID();

        when(actionRepository.findByFeedbackIdAndId(feedbackId, actionId)).thenReturn(Optional.empty());

        ResponseStatusException ex = assertThrows(
                ResponseStatusException.class,
                () -> actionServiceImpl.getActionById(feedbackId, actionId)
        );

        assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
        assertTrue(ex.getMessage().contains("action not found"));


        verify(actionRepository).findByFeedbackIdAndId(feedbackId, actionId);
        verifyNoMoreInteractions(actionRepository);
    }

    @Test
    @DisplayName("listActionsForFeedback() -> Success")
    void listActionsForFeedbackSuccess() {
        UUID feedbackId = UUID.randomUUID();
        UUID workspaceId = UUID.randomUUID();
        Workspace existingWorkspace = new Workspace(
                workspaceId,
                "test",
                Instant.parse("2026-03-09T12:00:00Z"),
                Instant.parse("2026-03-09T12:00:00Z")
        );

        Sort sort = Sort.by(Sort.Direction.DESC, "createdAt");

        Feedback existingFeedback = new Feedback(
                feedbackId,
                existingWorkspace,
                "testFeedback",
                "testing",
                "TEST",
                Instant.parse("2026-03-09T12:00:00Z"),
                Instant.parse("2026-03-09T12:00:00Z")
        );

        UUID a1Id = UUID.randomUUID();
        UUID a2Id = UUID.randomUUID();

        Action a1 = Action.builder()
                .id(a1Id)
                .feedback(existingFeedback)
                .title("task 1")
                .description("testing task 2")
                .status(ActionStatus.TODO)
                .createdAt(Instant.parse("2026-04-07T12:00:00Z"))
                .updatedAt(Instant.parse("2026-04-07T12:00:00Z"))
                .build();

        Action a2 = Action.builder()
                .id(a2Id)
                .feedback(existingFeedback)
                .title("task 2")
                .description("testing task 2")
                .status(ActionStatus.TODO)
                .createdAt(Instant.parse("2026-04-06T12:00:00Z"))
                .updatedAt(Instant.parse("2026-04-06T12:00:00Z"))
                .build();

        when(feedbackRepository.existsById(feedbackId)).thenReturn(Boolean.TRUE);

        when(actionRepository.findByFeedbackId(feedbackId, sort)).thenReturn(List.of(a1, a2));

        List<ActionRespDto> resp = actionServiceImpl.listActionsForFeedback(feedbackId);

        assertNotNull(resp);
        assertEquals(2, resp.size());

        ActionRespDto resp1 = resp.getFirst();
        assertEquals(a1.getId(), resp1.id());
        assertEquals(a1.getTitle(), resp1.title());
        assertEquals(a1.getDescription(), resp1.description());
        assertEquals(a1.getCreatedAt(), resp1.createdAt());
        assertEquals(a1.getUpdatedAt(), resp1.updatedAt());
        assertEquals(a1.getStatus(), resp1.status());

        ActionRespDto resp2 = resp.get(1);
        assertEquals(a2.getId(), resp2.id());
        assertEquals(a2.getTitle(), resp2.title());
        assertEquals(a2.getDescription(), resp2.description());
        assertEquals(a2.getCreatedAt(), resp2.createdAt());
        assertEquals(a2.getUpdatedAt(), resp2.updatedAt());
        assertEquals(a2.getStatus(), resp2.status());

        assertTrue(resp1.createdAt().isAfter(resp2.createdAt()));

        verify(feedbackRepository).existsById(feedbackId);
        verify(actionRepository).findByFeedbackId(feedbackId, sort);
        verifyNoMoreInteractions(feedbackRepository, actionRepository);
    }

    @Test
    @DisplayName("updateActionStatus() -> Success")
    void updateActionStatusSuccess() {
        UUID feedbackId = UUID.randomUUID();
        UUID actionId = UUID.randomUUID();
        UUID workspaceId = UUID.randomUUID();
        Workspace existingWorkspace = new Workspace(
                workspaceId,
                "test",
                Instant.parse("2026-03-09T12:00:00Z"),
                Instant.parse("2026-03-09T12:00:00Z")
        );

        Feedback existingFeedback = new Feedback(
                feedbackId,
                existingWorkspace,
                "testFeedback",
                "testing",
                "TEST",
                Instant.parse("2026-03-10T12:00:00Z"),
                Instant.parse("2026-03-10T12:00:00Z")
        );

        Action existingAction = new Action(
                actionId,
                existingFeedback,
                "task",
                "testing",
                ActionStatus.TODO,
                Instant.parse("2026-04-07T12:00:00Z"),
                Instant.parse("2026-04-07T12:00:00Z")
        );

        when(actionRepository.findByFeedbackIdAndId(feedbackId, actionId)).thenReturn(Optional.of(existingAction));

        ArgumentCaptor<Action> captor = ArgumentCaptor.forClass(Action.class);

        when(actionRepository.save(captor.capture()))
                .thenAnswer(invocation -> {
                    Action action = (Action) invocation.getArguments()[0];
                    action.setUpdatedAt(Instant.parse("2026-04-08T12:00:00Z"));
                    return action;
                });

        UpdateActionStatusReqDto req = new UpdateActionStatusReqDto(ActionStatus.DONE);

        ActionRespDto resp = actionServiceImpl.updateActionStatus(feedbackId, actionId, req);

        assertEquals(existingAction.getId(), resp.id());
        assertEquals(existingAction.getTitle(), resp.title());
        assertEquals(existingAction.getDescription(), resp.description());
        assertEquals(ActionStatus.DONE, resp.status());
        assertEquals(existingAction.getCreatedAt(), resp.createdAt());
        assertEquals(Instant.parse("2026-04-08T12:00:00Z"), resp.updatedAt());

        Action savedAction = captor.getValue();
        assertEquals(ActionStatus.DONE, savedAction.getStatus());
        assertEquals(Instant.parse("2026-04-08T12:00:00Z"), savedAction.getUpdatedAt());

        verify(actionRepository).findByFeedbackIdAndId(feedbackId, actionId);
        verify(actionRepository).save(captor.capture());
        verifyNoMoreInteractions(actionRepository);

    }
}
