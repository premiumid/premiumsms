-- Migration 004: Fix status enum, add rate limiting table, add indexes

-- 1. Fix the rentals status enum to include 'cancelled' (double-l) alongside 'canceled'
--    We also add 'completed' which the app code uses but wasn't in the original CHECK.
ALTER TABLE rentals DROP CONSTRAINT IF EXISTS rentals_status_check;
ALTER TABLE rentals ADD CONSTRAINT rentals_status_check
  CHECK (status IN ('pending','active','received','completed','expired','canceled','cancelled','refunded'));

-- 2. Back-fill any 'canceled' (single-l) rows to 'cancelled' (double-l) for consistency
UPDATE rentals SET status = 'cancelled' WHERE status = 'canceled';

-- 3. Now tighten to the canonical set (remove single-l 'canceled' alias)
ALTER TABLE rentals DROP CONSTRAINT IF EXISTS rentals_status_check;
ALTER TABLE rentals ADD CONSTRAINT rentals_status_check
  CHECK (status IN ('pending','active','received','completed','expired','cancelled','refunded'));

-- 4. Rate limiting table (in-process sliding window via DB)
CREATE TABLE IF NOT EXISTS rate_limit_buckets (
  key TEXT NOT NULL,          -- e.g. "api:user_id" or "api:ip"
  window_start TIMESTAMPTZ NOT NULL DEFAULT now(),
  request_count INT NOT NULL DEFAULT 1,
  PRIMARY KEY (key, window_start)
);

-- Clean-up index so old windows don't pile up
CREATE INDEX IF NOT EXISTS idx_rate_limit_window ON rate_limit_buckets (window_start);

-- 5. Add updated_at to rentals if missing (for expiry job)
ALTER TABLE rentals ALTER COLUMN updated_at SET DEFAULT now();

-- 6. Index to speed up expiry sweep
CREATE INDEX IF NOT EXISTS idx_rentals_status_expires
  ON rentals (status, expires_at)
  WHERE status = 'active';

-- 7. Index to speed up sms_messages lookup
CREATE INDEX IF NOT EXISTS idx_sms_messages_rental
  ON sms_messages (rental_id, received_at DESC);
