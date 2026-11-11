CREATE TABLE IF NOT EXISTS member_sessions (
  token_hash TEXT PRIMARY KEY,
  member_id TEXT NOT NULL,
  expires_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS sessions_expiry ON member_sessions(expires_at);
CREATE TABLE IF NOT EXISTS login_limits (
  bucket TEXT PRIMARY KEY,
  attempts INTEGER NOT NULL,
  expires_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS limits_expiry ON login_limits(expires_at);
CREATE TABLE IF NOT EXISTS work_records (
  member_id TEXT NOT NULL,
  record_key TEXT NOT NULL,
  version INTEGER NOT NULL,
  envelope TEXT NOT NULL,
  mutation_id TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (member_id, record_key)
);
CREATE TABLE IF NOT EXISTS work_history (
  member_id TEXT NOT NULL,
  record_key TEXT NOT NULL,
  version INTEGER NOT NULL,
  envelope TEXT NOT NULL,
  mutation_id TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (member_id, record_key, version),
  UNIQUE (member_id, record_key, mutation_id)
);
