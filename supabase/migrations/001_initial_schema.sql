-- Users profile (extends Supabase Auth)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email TEXT NOT NULL,
  display_name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  is_banned BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Wallet
CREATE TABLE wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  balance DECIMAL(12,4) DEFAULT 0 CHECK (balance >= 0),
  currency TEXT DEFAULT 'USD',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Wallet transactions (ledger)
CREATE TABLE wallet_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id UUID REFERENCES wallets(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('topup', 'debit', 'refund', 'admin_credit')),
  amount DECIMAL(12,4) NOT NULL,
  balance_after DECIMAL(12,4) NOT NULL,
  description TEXT,
  reference_id TEXT, -- idempotency key
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Services (WhatsApp, Telegram, etc.)
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  icon_url TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Countries
CREATE TABLE countries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL, -- ISO 3166-1 alpha-2
  flag_emoji TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Service pricing per country
CREATE TABLE service_prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID REFERENCES services(id) ON DELETE CASCADE,
  country_id UUID REFERENCES countries(id) ON DELETE CASCADE,
  provider_cost DECIMAL(10,4) NOT NULL,
  user_price DECIMAL(10,4) NOT NULL,
  is_available BOOLEAN DEFAULT true,
  stock INT DEFAULT 0,
  UNIQUE(service_id, country_id)
);

-- Rental orders
CREATE TABLE rentals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id) ON DELETE CASCADE,
  country_id UUID REFERENCES countries(id) ON DELETE CASCADE,
  phone_number TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','active','received','expired','canceled','refunded')),
  provider_order_id TEXT,
  provider_name TEXT,
  price DECIMAL(10,4) NOT NULL,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- SMS messages received
CREATE TABLE sms_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rental_id UUID REFERENCES rentals(id) ON DELETE CASCADE,
  sender TEXT,
  message_text TEXT NOT NULL,
  received_at TIMESTAMPTZ DEFAULT now()
);

-- API keys for developers
CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  key_hash TEXT NOT NULL,
  prefix TEXT NOT NULL, -- first 8 chars for display
  name TEXT DEFAULT 'Default',
  is_active BOOLEAN DEFAULT true,
  last_used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS Enablement
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE rentals ENABLE ROW LEVEL SECURITY;
ALTER TABLE sms_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- Simple policies
CREATE POLICY "Public profiles are viewable by everyone." ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile." ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own wallet." ON wallets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own transactions." ON wallet_transactions FOR SELECT USING (wallet_id IN (SELECT id FROM wallets WHERE user_id = auth.uid()));

CREATE POLICY "Services are public." ON services FOR SELECT USING (true);
CREATE POLICY "Countries are public." ON countries FOR SELECT USING (true);
CREATE POLICY "Service prices are public." ON service_prices FOR SELECT USING (true);

CREATE POLICY "Users can view own rentals." ON rentals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own rentals." ON rentals FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own messages." ON sms_messages FOR SELECT USING (rental_id IN (SELECT id FROM rentals WHERE user_id = auth.uid()));

CREATE POLICY "Users can view own api keys." ON api_keys FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own api keys." ON api_keys FOR ALL USING (auth.uid() = user_id);
