-- Migration 006: Add missing indexes for query performance
-- Based on audit finding: all user-scoped queries doing sequential scans

-- User ID indexes for all user-scoped tables
CREATE INDEX IF NOT EXISTS idx_wallets_user_id ON wallets (user_id);
CREATE INDEX IF NOT EXISTS idx_rentals_user_id ON rentals (user_id);
CREATE INDEX IF NOT EXISTS idx_rentals_service_id ON rentals (service_id);
CREATE INDEX IF NOT EXISTS idx_rentals_country_id ON rentals (country_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON api_keys (user_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_key_hash ON api_keys (key_hash);

-- Crypto payments
CREATE INDEX IF NOT EXISTS idx_crypto_payments_user_id ON crypto_payments (user_id);
CREATE INDEX IF NOT EXISTS idx_crypto_payments_nowpayments_id ON crypto_payments (nowpayments_id);

-- Wallet transactions
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_wallet_id ON wallet_transactions (wallet_id);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_created_at ON wallet_transactions (wallet_id, created_at DESC);

-- Contact messages (admin queries)
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages (created_at DESC);

-- Profile lookup by email
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles (email);
