# API Contract Draft

## Public Endpoints

- POST /api/auth/signup.
- POST /api/auth/login.
- GET /api/services.
- GET /api/countries.
- POST /api/rentals.
- GET /api/rentals/:id.
- POST /api/rentals/:id/cancel.
- GET /api/rentals/:id/messages.
- GET /api/wallet.
- POST /api/wallet/topup.
- GET /api/developer/keys.

## Admin Endpoints

- GET /api/admin/rentals.
- GET /api/admin/users.
- POST /api/admin/refund.
- POST /api/admin/ban-user.
- POST /api/admin/provider/sync.

## Provider Adapter Interface

Each provider adapter should support:

- listServices().
- listCountries().
- createOrder().
- getOrderStatus().
- cancelOrder().
- fetchMessages().
- getBalance().

## Webhook Endpoint

- POST /api/webhooks/provider/sms.
- Verify signature.
- Map provider payload to internal message format.
- Update rental status when SMS arrives.

## API Design Notes

- Return consistent JSON.
- Use idempotency keys for payments and rental creation.
- Standardize error codes for insufficient balance, unavailable service, expired rental, and provider failure.
