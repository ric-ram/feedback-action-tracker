package com.ricram.feedback_action_tracker_api;

import com.ricram.feedback_action_tracker_api.dto.CreateFeedbackReqDto;
import com.ricram.feedback_action_tracker_api.dto.FeedbackRespDto;
import com.ricram.feedback_action_tracker_api.entity.Feedback;
import com.ricram.feedback_action_tracker_api.entity.Workspace;
import com.ricram.feedback_action_tracker_api.repository.FeedbackRepository;
import com.ricram.feedback_action_tracker_api.repository.WorkspaceRepository;
import com.ricram.feedback_action_tracker_api.service.impl.FeedbackServiceImpl;
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
import java.util.Spliterator;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class FeedbackServiceImplTests {

    @Mock
    private WorkspaceRepository workspaceRepository;

    @Mock
    private FeedbackRepository feedbackRepository;

    @InjectMocks
    private FeedbackServiceImpl feedbackService;

    private static final Instant NOW = Instant.now();

    @Test
    @DisplayName("createFeedbackForWorkspace() -> Success")
    void createFeedbackSuccessfully() {
        UUID feedbackId = UUID.randomUUID();
        UUID workspaceId = UUID.randomUUID();
        Workspace existingWorkspace = new Workspace(workspaceId,
                "test",
                Instant.parse("2026-02-28T12:00:00Z"),
                Instant.parse("2026-02-28T12:00:00Z"));

        when(workspaceRepository.findById(workspaceId)).thenReturn(Optional.of(existingWorkspace));

        ArgumentCaptor<Feedback> captor = ArgumentCaptor.forClass(Feedback.class);
        when(feedbackRepository.save(captor.capture()))
                .thenAnswer(invocation -> {
                   Feedback f = invocation.getArgument(0);
                   f.setId(feedbackId);
                   f.setWorkspace(existingWorkspace);
                   f.setCreatedAt(Instant.parse("2026-03-09T12:00:00Z"));
                   return f;
                });
        CreateFeedbackReqDto req = new CreateFeedbackReqDto("testFeedback", "testing", "EMAIL");

        FeedbackRespDto resp = feedbackService.createFeedbackForWorkspace(workspaceId, req);

        assertEquals(feedbackId, resp.id());
        assertEquals("testFeedback", resp.title());
        assertEquals("testing", resp.description());
        assertEquals("EMAIL", resp.source());

        Feedback savedFeedback = captor.getValue();
        assertEquals("testFeedback", savedFeedback.getTitle());
        assertEquals("testing", savedFeedback.getDescription());
        assertEquals(existingWorkspace, savedFeedback.getWorkspace());
        assertEquals("EMAIL", savedFeedback.getSource());
        assertNotNull(savedFeedback.getCreatedAt());

        verify(workspaceRepository).findById(workspaceId);
        verify(feedbackRepository).save(savedFeedback);
        verifyNoMoreInteractions(workspaceRepository);
        verifyNoMoreInteractions(feedbackRepository);
    }

    @Test
    @DisplayName("createFeedbackForWorkspace() -> Workspace not found")
    void createFeedbackForWorkspaceNotFound() {
        UUID workspaceId = UUID.randomUUID();

        when(workspaceRepository.findById(workspaceId)).thenReturn(Optional.empty());

        CreateFeedbackReqDto req = new CreateFeedbackReqDto("testFeedback", "testing", "EMAIL");

        ResponseStatusException ex = assertThrows(
                ResponseStatusException.class,
                () -> feedbackService.createFeedbackForWorkspace(workspaceId, req)
        );

        assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
        assertTrue(ex.getReason() != null && ex.getReason().contains("workspace not found"));

        verify(workspaceRepository).findById(workspaceId);
        verifyNoMoreInteractions(workspaceRepository);
        verifyNoInteractions(feedbackRepository);
    }

    @Test
    @DisplayName("getFeedbackById() -> Success")
    void getFeedbackByIdSuccessfully() {
        UUID feedbackId = UUID.randomUUID();
        Workspace existingWorkspace = new Workspace(
                UUID.randomUUID(),
                "test",
                Instant.parse("2026-03-09T12:00:00Z"),
                Instant.parse("2025-03-09T12:00:00Z")
        );

        Feedback existingFeedback = new Feedback(feedbackId,
                existingWorkspace,
                "testFeedback",
                "testing",
                "EMAIL",
                Instant.parse("2025-03-09T12:00:00Z"),
                Instant.parse("2026-03-09T12:10:00Z")
        );

        when(feedbackRepository.findById(feedbackId)).thenReturn(Optional.of(existingFeedback));

        FeedbackRespDto resp = feedbackService.getFeedbackById(feedbackId);

        assertEquals(existingFeedback.getId(), resp.id());
        assertEquals(existingFeedback.getTitle(), resp.title());
        assertEquals(existingFeedback.getDescription(), resp.description());
        assertEquals(existingFeedback.getSource(), resp.source());
        assertEquals(existingFeedback.getCreatedAt(), resp.createdAt());

        verify(feedbackRepository).findById(feedbackId);
        verifyNoMoreInteractions(feedbackRepository);
    }

    @Test
    @DisplayName("getFeedbackById() -> Feedback Not Found")
    void getFeedbackByIdWhenNoValidId() {
        UUID feedbackId = UUID.randomUUID();

        when(feedbackRepository.findById(feedbackId)).thenReturn(Optional.empty());

        ResponseStatusException ex = assertThrows(
                ResponseStatusException.class,
                () -> feedbackService.getFeedbackById(feedbackId)
        );

        assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
        assertTrue(ex.getReason() != null && ex.getReason().contains("feedback not found"));

        verify(feedbackRepository).findById(feedbackId);
        verifyNoMoreInteractions(feedbackRepository);
    }

    @Test
    @DisplayName("listFeedbackForWorkspace() -> Success")
    void listFeedbackForWorkspaceSuccessfully() {
        UUID workspaceId = UUID.randomUUID();
        Workspace existingWorkspace = new Workspace(workspaceId,
                "test",
                Instant.parse("2026-03-09T12:00:00Z"),
                Instant.parse("2026-03-09T12:00:00Z"));

        Sort sort = Sort.by(Sort.Direction.DESC, "createdAt");

        UUID f1Id = UUID.randomUUID();
        UUID f2Id = UUID.randomUUID();

        Feedback f1 = Feedback.builder()
                .id(f1Id)
                .workspace(existingWorkspace)
                .title("test feed 1")
                .description("testing feed 1")
                .source("EMAIL")
                .createdAt(Instant.parse("2026-03-11T12:00:00Z"))
                .updatedAt(Instant.parse("2026-03-11T12:00:00Z"))
                .build();

        Feedback f2 = Feedback.builder()
                .id(f2Id)
                .workspace(existingWorkspace)
                .title("test feed 2")
                .description("testing feed 2")
                .source("FORM")
                .createdAt(Instant.parse("2026-03-10T12:00:00Z"))
                .updatedAt(Instant.parse("2026-03-10T12:00:00Z"))
                .build();

        when(workspaceRepository.existsById(workspaceId))
                .thenReturn(true);

        when(feedbackRepository.findByWorkspaceId(workspaceId, sort)).thenReturn(List.of(f1, f2));

        List<FeedbackRespDto> resp = feedbackService.listFeedbackForWorkspace(workspaceId);

        assertNotNull(resp);
        assertEquals(2, resp.size());

        FeedbackRespDto first = resp.getFirst();
        assertEquals(f1.getId(), first.id());
        assertEquals(f1.getTitle(), first.title());
        assertEquals(f1.getDescription(), first.description());
        assertEquals(f1.getSource(), first.source());

        FeedbackRespDto second = resp.get(1);
        assertEquals(f2.getId(), second.id());
        assertEquals(f2.getTitle(), second.title());
        assertEquals(f2.getDescription(), second.description());
        assertEquals(f2.getSource(), second.source());

        assertTrue(first.createdAt().isAfter(second.createdAt()));

        verify(workspaceRepository).existsById(workspaceId);
        verify(feedbackRepository).findByWorkspaceId(workspaceId, sort);
        verifyNoMoreInteractions(workspaceRepository);
        verifyNoMoreInteractions(feedbackRepository);
    }
}
