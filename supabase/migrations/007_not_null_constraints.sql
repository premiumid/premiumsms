-- Migration 007: Add NOT NULL constraints on foreign keys
-- Based on audit finding: FK columns should be NOT NULL to prevent orphan data

-- wallets.user_id is already NOT NULL from 001 (REFERENCES profiles ON DELETE CASCADE)
-- services.id etc are PKs so already NOT NULL

-- wallet_transactions.wallet_id: add NOT NULL
ALTER TABLE wallet_transactions ALTER COLUMN wallet_id SET NOT NULL;

-- rentals.user_id, service_id, country_id: add NOT NULL
ALTER TABLE rentals ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE rentals ALTER COLUMN service_id SET NOT NULL;
ALTER TABLE rentals ALTER COLUMN country_id SET NOT NULL;

-- api_keys.user_id: add NOT NULL
ALTER TABLE api_keys ALTER COLUMN user_id SET NOT NULL;

-- crypto_payments.user_id is already NOT NULL from 003

-- sms_messages.rental_id: add NOT NULL
ALTER TABLE sms_messages ALTER COLUMN rental_id SET NOT NULL;

-- wallet_transactions.reference_id: add UNIQUE constraint for idempotency
CREATE UNIQUE INDEX IF NOT EXISTS idx_wallet_transactions_reference_id
  ON wallet_transactions (reference_id)
  WHERE reference_id IS NOT NULL;

-- wallet_transactions.type: add NOT NULL
ALTER TABLE wallet_transactions ALTER COLUMN type SET NOT NULL;
