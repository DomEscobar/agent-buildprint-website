# Stripe Billing Extension Spec

## Goal

Add a paid SaaS billing feature with Stripe Checkout, customer portal, verified webhooks, server-side subscription state, entitlement checks, and a billing settings UI.

## Core behaviors

1. Checkout creation requires an authenticated user and a server-selected price id.
2. Customer portal creation requires the authenticated user's stored Stripe customer id.
3. Webhooks must verify the Stripe signature before changing subscription state.
4. Subscription state is stored server-side and includes customer id, subscription id, price id, status, period end, and update time.
5. Premium access is granted only from server-side subscription state, never from frontend flags/query params.
6. The billing UI reflects server state and offers checkout / portal actions.
7. Local tests use mocked Stripe/provider events and no network calls.

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
