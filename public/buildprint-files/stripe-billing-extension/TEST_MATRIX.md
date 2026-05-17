# Stripe Billing Extension Test Matrix

| Risk | Required test |
| --- | --- |
| Checkout uses client-chosen unsafe state | Checkout requires authenticated user and server price id |
| Portal exposes another customer's billing | Portal uses stored customer id for authenticated user only |
| Webhook spoofing grants access | Missing/invalid signature rejects before mutation |
| Subscription state drift | Webhook events update status and period server-side |
| Failed payments still grant access | `past_due` / `unpaid` deny premium entitlement |
| Canceled subscription still grants access | `canceled` denies premium entitlement |
| Expired active period grants access | expired `currentPeriodEnd` denies entitlement |
| Secret leakage | Docs/examples use env var names only, no secret values |

## Dry-run result

A clean Codex dry-run generated an offline TypeScript proof and passed:

- `npm run build`
- `npm test` → 6/6 tests passing
