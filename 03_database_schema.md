# Database Schema Draft

## Core Tables

- users.
- wallets.
- wallet_transactions.
- countries.
- services.
- provider_numbers.
- rentals.
- inbound_messages.
- api_keys.
- audit_logs.
- support_tickets.

## Rentals Table

Recommended fields:

- id.
- user_id.
- provider_order_id.
- service_code.
- country_code.
- phone_number.
- status.
- price.
- cost.
- created_at.
- expires_at.
- completed_at.
- canceled_at.
- refunded_at.

## Inbound Messages Table

Recommended fields:

- id.
- rental_id.
- provider_message_id.
- sender.
- message_body.
- received_at.
- raw_payload.

## Wallet Transactions Table

Recommended fields:

- id.
- user_id.
- type.
- amount.
- currency.
- reference.
- status.
- created_at.

## Indexes

- rentals by user_id and status.
- inbound_messages by rental_id.
- wallet_transactions by user_id.
- api_keys by hashed key prefix.

## Data Rules

- Never store secrets in plain text.
- Keep immutable logs for balance changes.
- Track provider state changes separately from user actions.
