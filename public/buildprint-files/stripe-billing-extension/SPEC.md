# Stripe Billing Extension Spec

## Goal

Add a paid SaaS billing feature with Stripe Checkout, customer portal, verified webhooks, server-side subscription state, entitlement checks, and a billing settings UI. The Buildprint is backend-stack agnostic: implement the same contracts in the user's existing stack instead of forcing the TypeScript proof structure.

## Core behaviors

1. Checkout creation requires an authenticated user and a server-selected price id.
2. Customer portal creation requires the authenticated user's stored Stripe customer id.
3. Webhooks must verify the Stripe signature before changing subscription state.
4. Subscription state is stored server-side and includes customer id, subscription id, price id, status, period end, and update time.
5. Premium access is granted only from server-side subscription state, never from frontend flags/query params.
6. The billing UI reflects server state and offers checkout / portal actions.
7. Local tests use mocked Stripe/provider events and no network calls.
8. Target-stack adapters preserve the same security boundaries in Node/TypeScript, Python, Rails, Go, PHP/Laravel, or another backend.

## Subscription statuses

Handle at minimum:

- `trialing`
- `active`
- `past_due`
- `canceled`
- `unpaid`
- `none`

## Required environment variable names

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_PRICE_PRO`
- `APP_BILLING_SUCCESS_URL`
- `APP_BILLING_CANCEL_URL`
- `APP_BILLING_PORTAL_RETURN_URL`

Use names only in generated examples unless the human provides real values separately.

## Target stack adaptation

Before implementation, inspect the host app's:

- backend language and framework
- routing style
- auth/current-user access pattern
- database/ORM/storage layer
- existing user/account/team model
- test runner and mocking style

Then adapt the universal billing contract from `TARGET_STACK_ADAPTERS.md`. The TypeScript proof is a behavioral reference only.
