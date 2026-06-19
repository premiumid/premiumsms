-- Migration 008: Enable Supabase Realtime for core tables safely

DO $$
BEGIN
  -- Drop tables from publication if they exist in it
  IF EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'rentals'
  ) THEN
    ALTER PUBLICATION supabase_realtime DROP TABLE public.rentals;
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'sms_messages'
  ) THEN
    ALTER PUBLICATION supabase_realtime DROP TABLE public.sms_messages;
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'crypto_payments'
  ) THEN
    ALTER PUBLICATION supabase_realtime DROP TABLE public.crypto_payments;
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'wallets'
  ) THEN
    ALTER PUBLICATION supabase_realtime DROP TABLE public.wallets;
  END IF;

  -- Add tables to the realtime publication
  ALTER PUBLICATION supabase_realtime ADD TABLE public.rentals;
  ALTER PUBLICATION supabase_realtime ADD TABLE public.sms_messages;
  ALTER PUBLICATION supabase_realtime ADD TABLE public.crypto_payments;
  ALTER PUBLICATION supabase_realtime ADD TABLE public.wallets;
END $$;
