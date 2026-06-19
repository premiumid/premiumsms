-- Migration 008: Enable Supabase Realtime for core tables

-- Drop the tables from publication first if they somehow exist to avoid conflicts (safe migration)
alter publication supabase_realtime drop table if exists public.rentals;
alter publication supabase_realtime drop table if exists public.sms_messages;
alter publication supabase_realtime drop table if exists public.crypto_payments;
alter publication supabase_realtime drop table if exists public.wallets;

-- Add tables to the realtime publication
alter publication supabase_realtime add table public.rentals;
alter publication supabase_realtime add table public.sms_messages;
alter publication supabase_realtime add table public.crypto_payments;
alter publication supabase_realtime add table public.wallets;
