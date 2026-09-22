-- Sinew fitness tracker schema

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  daily_water_goal_ml INTEGER NOT NULL DEFAULT 2000,
  daily_steps_goal INTEGER NOT NULL DEFAULT 8000,
  daily_sleep_goal_hours NUMERIC(4,1) NOT NULL DEFAULT 8.0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- One row per logged entry. type is one of: 'walk', 'water', 'sleep'
-- value_unit stays fixed per type (steps, ml, hours) so charts don't need conversion logic.
CREATE TABLE IF NOT EXISTS logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('walk', 'water', 'sleep')),
  value NUMERIC NOT NULL CHECK (value > 0),
  logged_at DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_logs_user_date ON logs (user_id, logged_at);
