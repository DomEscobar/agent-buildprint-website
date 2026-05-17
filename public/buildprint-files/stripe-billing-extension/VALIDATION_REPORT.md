# Validation

## Scope

The runnable proof is TypeScript, but the Buildprint is now explicitly stack-adaptable. `TARGET_STACK_ADAPTERS.md` documents how to preserve the same billing contract in Python, Rails, Go, PHP/Laravel, Node/TypeScript, or another backend.

## What Works

- Checkout creation is implemented through an injectable `BillingProvider`; the included `MockBillingProvider` returns deterministic local URLs and performs no network calls.
- Customer portal creation requires an authenticated user id and a stored customer relation, preventing arbitrary customer id access.
- Webhook handling requires a `stripe-signature` header and delegates verification to a mockable `SignatureVerifier` before mutating state.
- Subscription state is stored server-side with local customer, subscription, price, status, and current period fields.
- Entitlement checks read only server-side subscription state and grant premium access only for `active` or `trialing` subscriptions with a valid period.
- Billing UI stub renders from server state and posts to checkout and portal endpoints.
- Lifecycle tests cover checkout, portal, verified webhooks, `trialing`, `active`, `past_due`, `canceled`, `unpaid`, and entitlement behavior.
- Environment variables are documented by name only; no real Stripe secrets or API calls are included.

## Blueprint Gaps

- This proof uses in-memory storage instead of a production database.
- HTTP route adapters are represented by service functions rather than a framework-specific server.
- The signature verifier is mock-only; a production adapter would wrap Stripe SDK verification later.
- Trial configuration is represented by subscription status events, not a real Stripe checkout trial setting.
- Non-TypeScript stacks are specified through adapter guidance, not separately runnable proofs yet.
