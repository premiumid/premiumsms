-- Migration 003: Crypto payment tracking table
-- Used to store NOWPayments invoices and ensure idempotent wallet crediting

create table if not exists public.crypto_payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  nowpayments_id text unique not null,
  order_id text not null,
  amount_usd numeric(10,2) not null,
  pay_amount numeric(20,8),
  pay_currency text default 'usdtbsc',
  pay_address text,
  status text default 'waiting',
  processed boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS: Users can only see their own payment records
alter table public.crypto_payments enable row level security;

create policy "Users can read own payments"
  on public.crypto_payments for select
  using (auth.uid() = user_id);

-- Auto-update updated_at on changes
create or replace function update_crypto_payments_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger crypto_payments_updated_at
  before update on public.crypto_payments
  for each row execute function update_crypto_payments_updated_at();
