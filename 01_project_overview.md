# SMS Verification Platform Overview

## Goal

Build a JuicySMS ( [https://juicysms.com/](https://juicysms.com/)  and [https://virtualsms.io](https://virtualsms.io) ) -style platform where users can rent real non-VoIP numbers, receive OTP codes, and manage rentals from a clean web dashboard.

## Product Summary

The platform should support country and service selection, instant rental, live SMS inbox updates, wallet balance, refunds, and an API for power users.

## Recommended Stack

- Frontend: Next.js.
- Backend: Next.js API routes or server actions.
- Database: Supabase Postgres.
- Realtime: Supabase Realtime or websockets.
- Payments: Crypto first, with optional Rwanda mobile money.
- Automation: n8n for alerts, refunds, and background jobs.

## Core User Flow

1. User signs up.
2. User adds funds.
3. User selects a service and country.
4. System creates a rental order with the SMS provider.
5. Incoming SMS appears in the inbox.
6. Order expires, is canceled, or is reused depending on provider rules.

## Main Pages

- Landing page.
- Pricing page.
- Services page.
- Number rental page.
- Inbox page.
- Wallet page.
- Developer API page.
- Admin dashboard.

## Important Product Rules

- Keep the interface fast and mobile-first.
- Use clear state labels like pending, active, received, expired, canceled, and refunded.
- Separate user funds from operational provider balances.
- Log all rental events for audit and support.
