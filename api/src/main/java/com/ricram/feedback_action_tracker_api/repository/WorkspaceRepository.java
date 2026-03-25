package com.ricram.feedback_action_tracker_api.repository;

import com.ricram.feedback_action_tracker_api.entity.Workspace;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface WorkspaceRepository extends JpaRepository<Workspace, UUID> {
}
