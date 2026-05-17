# Stripe Billing Extension Contracts

## BillingCustomer

```ts
type SubscriptionStatus = 'none' | 'trialing' | 'active' | 'past_due' | 'canceled' | 'unpaid';

type BillingCustomer = {
  userId: string;
  email: string;
  stripeCustomerId: string;
  subscriptionId?: string;
  priceId?: string;
  status: SubscriptionStatus;
  currentPeriodEnd?: Date;
  updatedAt: Date;
};
```

## CheckoutSessionRequest

```ts
type CheckoutSessionRequest = {
  userId: string;
  email: string;
  priceId: string;
  successUrl: string;
  cancelUrl: string;
};
```

## PortalSessionRequest

```ts
type PortalSessionRequest = {
  userId: string;
  stripeCustomerId: string;
  returnUrl: string;
};
```

## Webhook boundary

- Input must include raw request body and `stripe-signature` header.
- Verify signature before parsing/trusting event payload for state mutation.
- In tests, use an injectable verifier/mock. In production, wrap Stripe SDK verification.

## Entitlement contract

```ts
hasServerEntitlement(userId, 'premium') => boolean
```

Must read server-side billing state. Must not trust frontend flags, query params, cookies without server verification, or returned checkout URLs.
