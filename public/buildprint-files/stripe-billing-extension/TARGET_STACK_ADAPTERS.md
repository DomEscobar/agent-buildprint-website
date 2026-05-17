# Stripe Billing Extension Target Stack Adapters

The Stripe Billing Extension is a portable feature Buildprint. The TypeScript proof is only a verified reference implementation; agents should adapt the same contracts to the user's backend stack.

## Universal contract

Every implementation, regardless of language/framework, must provide these boundaries:

1. **Checkout creation**
   - Authenticated server endpoint/action.
   - Uses a server-selected price id.
   - Creates or reuses the billing customer relation.
   - Returns a checkout redirect/session URL.

2. **Customer portal creation**
   - Authenticated server endpoint/action.
   - Looks up the current user's stored Stripe customer id.
   - Never accepts arbitrary customer ids from the client.
   - Returns a portal redirect/session URL.

3. **Webhook verification**
   - Uses the raw request body, not a reserialized JSON body.
   - Reads the `Stripe-Signature` / `stripe-signature` header.
   - Verifies the signature before trusting event data or mutating state.

4. **Subscription state store**
   - Persists user/account id, Stripe customer id, subscription id, price id, subscription status, current period end, and update time.
   - Handles at least `trialing`, `active`, `past_due`, `canceled`, `unpaid`, and `none`.

5. **Server-side entitlement guard**
   - Reads persisted server-side subscription state.
   - Grants paid access only for allowed statuses, normally `active` and valid-period `trialing`.
   - Never trusts frontend flags, checkout return query params, or client-provided status.

6. **Billing UI / settings surface**
   - Shows server-derived billing status.
   - Provides checkout and portal actions.
   - Does not expose secret keys or raw customer ids unnecessarily.

7. **Mocked tests**
   - Tests checkout and portal service boundaries without real Stripe calls.
   - Tests webhook signature failure before mutation.
   - Tests lifecycle transitions and entitlement denial for failed/canceled/unpaid/expired states.

## Stack adapters

### Node / TypeScript

Use for Next.js, Express, Hono, Astro server routes, Remix, NestJS, or similar.

- Checkout: server route/action calls Stripe Checkout Session creation.
- Portal: server route/action calls Stripe Billing Portal Session creation using stored customer id.
- Webhook: route must disable automatic body parsing or access raw body before parsing.
- Store: Prisma/Drizzle/SQL model, document store, or existing account table extension.
- Entitlements: server middleware, loader guard, API guard, or service-level check.
- Tests: mocked provider object plus mocked verified Stripe events.

### Python

Use for FastAPI, Django, Flask, Litestar, or similar.

- Checkout:
  - FastAPI/Flask: authenticated `POST /billing/checkout` handler.
  - Django: authenticated view or DRF action.
- Portal:
  - Authenticated `POST /billing/portal` handler/view.
  - Lookup `stripe_customer_id` from the current user/account record.
- Webhook:
  - Use raw `request.body` / `await request.body()` for signature verification.
  - Verify with Stripe's Python SDK before processing the event.
- Store:
  - Django model, SQLAlchemy model, or existing user/account billing table.
- Entitlements:
  - Dependency/middleware/decorator/service function such as `require_premium(user)`.
- Tests:
  - Pytest with monkeypatched Stripe client and fixture webhook payloads.
  - Assert invalid signatures do not update the database.

### Ruby / Rails

- Checkout: authenticated controller action, e.g. `BillingController#create_checkout`.
- Portal: authenticated controller action using the current account's stored customer id.
- Webhook: controller endpoint must read `request.raw_post` for signature verification.
- Store: ActiveRecord model or account billing columns.
- Entitlements: policy object, controller before_action, or service guard.
- Tests: RSpec/request specs with mocked Stripe session/event constructors.

### Go

- Checkout: `net/http`, Chi, Gin, Fiber, or Echo handler requiring authenticated user context.
- Portal: handler uses stored customer id, never a client-provided customer id.
- Webhook: read raw request bytes before decoding JSON; verify signature first.
- Store: SQL table/repository interface for billing state.
- Entitlements: middleware or service function returning allow/deny.
- Tests: Go unit tests with fake Stripe client and fixture event structs.

### PHP / Laravel

- Checkout: authenticated controller method or action class.
- Portal: authenticated controller method using current user's stored customer id.
- Webhook: use raw request content for signature verification before event handling.
- Store: Eloquent model or billing columns on user/team/account.
- Entitlements: middleware, policy, gate, or service method.
- Tests: PHPUnit/Pest with mocked Stripe client and webhook fixtures.

## Adapter prompt for coding agents

When adapting to a target stack, first identify:

- framework and routing style
- auth/current-user access pattern
- database/ORM/storage layer
- existing user/account/team model
- environment variable conventions
- test runner and mocking style

Then implement the universal contract in that stack. Keep the TypeScript proof as a behavioral reference only; do not force TypeScript project structure into Python/Rails/Go/PHP apps.

## Required non-goals

- Do not claim production billing is complete without real Stripe SDK integration and configured webhook endpoint.
- Do not call real Stripe APIs in tests.
- Do not store or publish secret values.
- Do not grant access from checkout success URLs alone.
- Do not skip raw-body webhook signature verification.
