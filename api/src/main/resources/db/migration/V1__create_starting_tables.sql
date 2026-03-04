CREATE TABLE workspace (
    id          UUID PRIMARY KEY,
    name        VARCHAR(255) NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE feedback (
    id              UUID PRIMARY KEY,
    workspace_id    UUID NOT NULL REFERENCES workspace(id),
    title           VARCHAR(255) NOT NULL,
    description     TEXT,
    source          VARCHAR(50),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_feedback_workspace_id ON feedback(workspace_id);
CREATE INDEX idx_feedback_workspace_created_at ON feedback(workspace_id, created_at DESC);