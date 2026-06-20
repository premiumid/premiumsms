-- Migration 009: Add Webhook URL to profiles

ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS webhook_url TEXT;

-- Create an admin stats view for easy querying from the dashboard
CREATE OR REPLACE VIEW admin_stats AS
SELECT
  (SELECT COUNT(*) FROM profiles) as total_users,
  (SELECT COUNT(*) FROM rentals WHERE status = 'active') as active_rentals,
  (SELECT COALESCE(SUM(amount), 0) FROM wallet_transactions WHERE type = 'topup') as total_revenue,
  (SELECT COUNT(*) FROM sms_messages) as total_sms_received;
