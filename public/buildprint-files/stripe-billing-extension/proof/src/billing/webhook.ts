import { BillingError } from "./errors.js";
import type { BillingStore } from "./store.js";
import type { BillingEvent, WebhookHeaders } from "./types.js";
import type { SignatureVerifier } from "./webhookVerifier.js";

export interface WebhookHandlerOptions {
  rawBody: string;
  headers: WebhookHeaders;
  webhookSecret: string;
  verifier: SignatureVerifier;
  store: BillingStore;
}

export async function handleBillingWebhook(options: WebhookHandlerOptions): Promise<BillingEvent> {
  const signature = options.headers["stripe-signature"];
  if (!signature) {
    throw new BillingError("Missing webhook signature", "WEBHOOK_SIGNATURE_MISSING");
  }

  const event = await options.verifier.verify(
    options.rawBody,
    signature,
    options.webhookSecret
  );

  await applyBillingEvent(options.store, event);
  return event;
}

export async function applyBillingEvent(
  store: BillingStore,
  event: BillingEvent
): Promise<void> {
  switch (event.type) {
    case "checkout.session.completed": {
      await store.upsertCustomer({
        userId: event.data.userId,
        email: event.data.email,
        stripeCustomerId: event.data.stripeCustomerId,
        subscriptionId: event.data.subscriptionId,
        priceId: event.data.priceId,
        status: event.data.status,
        currentPeriodEnd: event.data.currentPeriodEnd,
        updatedAt: new Date()
      });
      return;
    }

    case "customer.subscription.created":
    case "customer.subscription.updated": {
      await store.updateSubscriptionByStripeCustomerId(event.data.stripeCustomerId, {
        subscriptionId: event.data.subscriptionId,
        priceId: event.data.priceId,
        status: event.data.status,
        currentPeriodEnd: event.data.currentPeriodEnd
      });
      return;
    }

    case "customer.subscription.deleted": {
      await store.updateSubscriptionByStripeCustomerId(event.data.stripeCustomerId, {
        subscriptionId: event.data.subscriptionId,
        status: "canceled",
        currentPeriodEnd: event.data.endedAt ?? new Date()
      });
      return;
    }

    case "invoice.payment_failed": {
      await store.updateSubscriptionByStripeCustomerId(event.data.stripeCustomerId, {
        subscriptionId: event.data.subscriptionId,
        status: "past_due"
      });
      return;
    }
  }
}
