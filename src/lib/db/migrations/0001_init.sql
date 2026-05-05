CREATE TABLE IF NOT EXISTS campaigns (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  brand_name TEXT NOT NULL,
  platform TEXT NOT NULL DEFAULT 'X',
  status TEXT NOT NULL DEFAULT 'draft',
  active_phase TEXT NOT NULL DEFAULT 'brief',
  selected_angle_id TEXT,
  selected_variant_id TEXT,
  brief JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS campaign_phase_outputs (
  id TEXT PRIMARY KEY,
  campaign_id TEXT NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  phase TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'idle',
  version INTEGER NOT NULL DEFAULT 0,
  headline TEXT,
  summary TEXT,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  generated_by TEXT,
  stale_reason TEXT,
  error_message TEXT,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (campaign_id, phase)
);

CREATE INDEX IF NOT EXISTS campaign_phase_outputs_campaign_id_idx
  ON campaign_phase_outputs (campaign_id, phase);

CREATE TABLE IF NOT EXISTS campaign_runs (
  id TEXT PRIMARY KEY,
  campaign_id TEXT NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  mode TEXT NOT NULL,
  start_phase TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'queued',
  note TEXT,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS campaign_runs_campaign_id_idx
  ON campaign_runs (campaign_id, created_at DESC);

CREATE TABLE IF NOT EXISTS campaign_activity_logs (
  id TEXT PRIMARY KEY,
  campaign_id TEXT NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  run_id TEXT REFERENCES campaign_runs(id) ON DELETE SET NULL,
  phase TEXT NOT NULL,
  actor TEXT NOT NULL,
  kind TEXT NOT NULL,
  message TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS campaign_activity_logs_campaign_id_idx
  ON campaign_activity_logs (campaign_id, created_at DESC);

CREATE TABLE IF NOT EXISTS campaign_revisions (
  id TEXT PRIMARY KEY,
  campaign_id TEXT NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  phase TEXT NOT NULL,
  note TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS campaign_revisions_campaign_id_idx
  ON campaign_revisions (campaign_id, created_at DESC);
