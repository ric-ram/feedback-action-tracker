package com.ricram.feedback_action_tracker_api.repository;

import com.ricram.feedback_action_tracker_api.entity.Action;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ActionRepository extends JpaRepository<Action, UUID> {
    List<Action> findByFeedbackId(UUID feedbackId, Sort sort);

    Optional<Action> findByFeedbackIdAndId(UUID feedbackId, UUID actionId);
}
