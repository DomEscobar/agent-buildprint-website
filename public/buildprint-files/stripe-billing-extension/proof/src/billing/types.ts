export type SubscriptionStatus =
  | "none"
  | "trialing"
  | "active"
  | "past_due"
  | "canceled"
  | "unpaid";

export type Entitlement = "premium";

export interface BillingCustomer {
  userId: string;
  email: string;
  stripeCustomerId: string;
  subscriptionId?: string;
  priceId?: string;
  status: SubscriptionStatus;
  currentPeriodEnd?: Date;
  updatedAt: Date;
}

export interface CheckoutSessionRequest {
  userId: string;
  email: string;
  priceId: string;
  successUrl: string;
  cancelUrl: string;
}

export interface CheckoutSessionResult {
  id: string;
  url: string;
  stripeCustomerId: string;
}

export interface PortalSessionRequest {
  userId: string;
  stripeCustomerId: string;
  returnUrl: string;
}

export interface PortalSessionResult {
  id: string;
  url: string;
}

export type BillingEvent =
  | {
      type: "checkout.session.completed";
      data: {
        userId: string;
        email: string;
        stripeCustomerId: string;
        subscriptionId: string;
        priceId: string;
        status: Extract<SubscriptionStatus, "trialing" | "active">;
        currentPeriodEnd: Date;
      };
    }
  | {
      type: "customer.subscription.created" | "customer.subscription.updated";
      data: {
        stripeCustomerId: string;
        subscriptionId: string;
        priceId: string;
        status: Exclude<SubscriptionStatus, "none">;
        currentPeriodEnd?: Date;
      };
    }
  | {
      type: "customer.subscription.deleted";
      data: {
        stripeCustomerId: string;
        subscriptionId: string;
        endedAt?: Date;
      };
    }
  | {
      type: "invoice.payment_failed";
      data: {
        stripeCustomerId: string;
        subscriptionId: string;
      };
    };

export interface WebhookHeaders {
  "stripe-signature"?: string;
}
