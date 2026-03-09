package com.ricram.feedback_action_tracker_api.repository;

import com.ricram.feedback_action_tracker_api.entity.Feedback;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface FeedbackRepository extends JpaRepository<Feedback, UUID> {
    List<Feedback> findByWorkspaceId(UUID workspaceId, Sort sort);
}
