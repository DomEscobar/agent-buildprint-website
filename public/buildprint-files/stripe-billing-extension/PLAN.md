# Stripe Billing Extension Plan

## Phase 0 — Target stack alignment

Identify the host app's backend stack, routing style, auth/current-user pattern, database/ORM, existing user/account/team model, and test runner. Read `TARGET_STACK_ADAPTERS.md` and choose the closest adapter before writing code.

Do not force TypeScript proof structure into non-TypeScript apps. Preserve the universal billing contract and security boundaries.

## Phase 1 — Data model

Define a billing customer/subscription state model connected to the app user/account.

## Phase 2 — Checkout endpoint

Create a server endpoint/service that creates a checkout session using a server-selected price id and authenticated user id.

## Phase 3 — Portal endpoint

Create a portal endpoint/service that looks up the authenticated user's stored Stripe customer id. Never accept arbitrary customer ids from the client.

## Phase 4 — Webhooks

Implement raw-body webhook handling with Stripe signature verification before state mutation.

Handle:

- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_failed`

## Phase 5 — Entitlements

Implement server-side entitlement guards. Premium access should be true only for valid `active` or `trialing` subscriptions with an unexpired period.

## Phase 6 — Billing UI

Add a simple settings page/component showing current billing status plus checkout and portal actions.

## Phase 7 — Tests

Use mocked provider sessions and mocked verified webhook events. Test checkout, portal auth, signature failure, status transitions, and entitlement denial.
