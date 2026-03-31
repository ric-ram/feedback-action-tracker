package com.ricram.feedback_action_tracker_api.controller;


import com.ricram.feedback_action_tracker_api.dto.ActionRespDto;
import com.ricram.feedback_action_tracker_api.dto.CreateActionReqDto;
import com.ricram.feedback_action_tracker_api.service.ActionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.UUID;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/feedback/{feedbackId}/actions")
@RequiredArgsConstructor
public class ActionController {

    private final ActionService actionService;

    @PostMapping
    public ResponseEntity<ActionRespDto> createAction(@PathVariable UUID feedbackId, @Valid @RequestBody CreateActionReqDto actionReqDto) {
        ActionRespDto resp = actionService.createActionForFeedback(feedbackId, actionReqDto);
        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{actionId}")
                .buildAndExpand(resp.id())
                .toUri();

        return ResponseEntity
                .created(location)
                .body(resp);
    }

    @GetMapping("/{actionId}")
    public ResponseEntity<ActionRespDto> getActionById(@PathVariable UUID actionId) {
        ActionRespDto resp = actionService.getActionById(actionId);

        return ResponseEntity
                .ok()
                .body(resp);
    }
}
