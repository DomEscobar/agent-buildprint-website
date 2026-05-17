# Local SaaS Billing Proof

Offline TypeScript proof for the Stripe Billing Extension Buildprint.

This module demonstrates checkout creation, customer portal creation, verified webhook handling through an injectable verifier, subscription state storage, server-side entitlement checks, a billing UI stub, and mocked lifecycle tests.

No real Stripe SDK, Stripe keys, or network APIs are used.

## Environment Variable Names

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_PRICE_PRO`
- `APP_BILLING_SUCCESS_URL`
- `APP_BILLING_CANCEL_URL`
- `APP_BILLING_PORTAL_RETURN_URL`

## Commands

```sh
npm test
npm run build
```
