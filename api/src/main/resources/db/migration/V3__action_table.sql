CREATE TABLE action (
    id          UUID PRIMARY KEY,
    feedback_id UUID NOT NULL REFERENCES feedback(id) ON DELETE CASCADE,
    title       VARCHAR(255) NOT NULL,
    description TEXT,
    status      VARCHAR(25) NOT NULL CHECK ( status IN ('TODO', 'IN_PROGRESS', 'DONE') ),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_action_feedback_id ON action(feedback_id);
CREATE INDEX idx_action_feedback_created_at ON action(feedback_id, created_at DESC);