package com.ricram.feedback_action_tracker_api.controller;

import com.ricram.feedback_action_tracker_api.dto.CreateFeedbackReqDto;
import com.ricram.feedback_action_tracker_api.dto.FeedbackRespDto;
import com.ricram.feedback_action_tracker_api.service.FeedbackService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;
import java.util.UUID;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/feedback")
@RequiredArgsConstructor
public class FeedbackController {

    private final FeedbackService feedbackService;

    @PostMapping
    public ResponseEntity<FeedbackRespDto> createFeedback(/*@PathVariable UUID workspaceId, */@Valid @RequestBody CreateFeedbackReqDto feedbackReqDto) {
        FeedbackRespDto resp = feedbackService.createFeedbackForWorkspace(/*workspaceId*/UUID.fromString("00000000-0000-0000-0000-000000000001"), feedbackReqDto);
        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{feedbackId}")
                .buildAndExpand(resp.id())
                .toUri();

        return ResponseEntity
                .created(location)
                .body(resp);

    }

    @GetMapping("/{feedbackId}")
    public ResponseEntity<FeedbackRespDto> getFeedbackById(@PathVariable UUID feedbackId) {
        FeedbackRespDto resp = feedbackService.getFeedbackById(feedbackId);

        return ResponseEntity
                .ok()
                .body(resp);
    }

    @GetMapping
    public ResponseEntity<List<FeedbackRespDto>> listFeedback(/*@PathVariable UUID workspaceId*/) {
        List<FeedbackRespDto> resp = feedbackService.listFeedbackForWorkspace(/*workspaceId*/UUID.fromString("00000000-0000-0000-0000-000000000001"));

        return ResponseEntity
                .ok()
                .body(resp);
    }

}
