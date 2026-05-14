---
title: Stripe Billing Extension
slug: stripe-billing-extension
category: Extension
stack: [TypeScript, Stripe, Webhooks, SaaS]
difficulty: Medium
---

# Stripe Billing Extension Buildprint

## What this builds

A SaaS billing module with Stripe Checkout, subscriptions, trials, customer portal, verified webhooks, server-side subscription state, entitlement guards, billing UI, and lifecycle tests.

## When to use

Use this when adding paid plans to a SaaS/product app.

## Inputs / assumptions

- Existing user/account model or a placeholder customer model.
- Stripe account and keys available later via environment variables.
- Server-side API route capability.
- Database or storage for subscription/customer state.

## Implementation plan

1. Define billing data model:
   - user/customer relation
   - stripe customer id
   - subscription id
   - plan/price id
   - status
   - current period end
2. Add checkout session creation endpoint.
3. Add customer portal endpoint.
4. Add webhook endpoint with signature verification.
5. Handle events:
   - checkout.session.completed
   - customer.subscription.created/updated/deleted
   - invoice.payment_failed
6. Add entitlement guard that reads server-side state.
7. Add billing UI/settings page.
8. Add tests with mocked Stripe events.
9. Document required env vars by name only.

## Acceptance checks

- Webhook signatures are verified.
- Premium access never trusts frontend state.
- Portal requires authenticated user/customer.
- Trialing, active, past_due, canceled, and unpaid states are handled.
- Tests cover checkout creation, webhook updates, and entitlement guard.
- No secret values are committed.

## Risks / when not to use

- Do not fake payment state in production.
- Do not skip webhook verification.
- Do not grant access from query params or frontend flags.
- Do not expose portal for another user's customer id.

## Copyable agent prompt

Build a Stripe Billing Extension from this Buildprint. Implement a local TypeScript SaaS billing module with checkout creation, customer portal, verified webhook handling, subscription state storage, entitlement guard, billing UI stub, and mocked lifecycle tests. Use environment variable names only; do not include secret values. Never trust frontend state for paid access.
