import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  BillingError,
  BillingService,
  InMemoryBillingStore,
  MockBillingProvider,
  MockSignatureVerifier,
  applyBillingEvent,
  handleBillingWebhook,
  hasServerEntitlement,
  renderBillingSettings,
  requireServerEntitlement,
  type BillingEvent
} from "../src/index.js";

const future = new Date("2099-01-01T00:00:00.000Z");
const past = new Date("2020-01-01T00:00:00.000Z");

describe("local SaaS billing proof", () => {
  it("creates checkout without calling a network provider", async () => {
    const store = new InMemoryBillingStore();
    const provider = new MockBillingProvider();
    const service = new BillingService(store, provider);

    const session = await service.createCheckoutSession({
      userId: "user_1",
      email: "buyer@example.test",
      priceId: "STRIPE_PRICE_PRO",
      successUrl: "APP_BILLING_SUCCESS_URL",
      cancelUrl: "APP_BILLING_CANCEL_URL"
    });

    assert.equal(session.id.startsWith("cs_test_"), true);
    assert.equal(provider.checkoutRequests.length, 1);
    assert.equal((await store.getByUserId("user_1"))?.status, "none");
  });

  it("creates a portal only for the authenticated user's stored customer", async () => {
    const store = new InMemoryBillingStore();
    const provider = new MockBillingProvider();
    const service = new BillingService(store, provider);

    await assert.rejects(
      () => service.createCustomerPortalSession("user_1", "APP_BILLING_PORTAL_RETURN_URL"),
      /No billing customer/
    );

    await service.createCheckoutSession({
      userId: "user_1",
      email: "buyer@example.test",
      priceId: "STRIPE_PRICE_PRO",
      successUrl: "APP_BILLING_SUCCESS_URL",
      cancelUrl: "APP_BILLING_CANCEL_URL"
    });

    const portal = await service.createCustomerPortalSession(
      "user_1",
      "APP_BILLING_PORTAL_RETURN_URL"
    );

    assert.equal(portal.id.startsWith("bps_test_"), true);
    assert.equal(provider.portalRequests[0]?.stripeCustomerId, "cus_test_user_1");
  });

  it("requires a valid webhook signature before mutating subscription state", async () => {
    const store = new InMemoryBillingStore();
    const event = checkoutCompleted("trialing");
    const verifier = new MockSignatureVerifier("valid-signature", event);

    await assert.rejects(
      () =>
        handleBillingWebhook({
          rawBody: "{}",
          headers: {},
          webhookSecret: "STRIPE_WEBHOOK_SECRET",
          verifier,
          store
        }),
      (error: unknown) =>
        error instanceof BillingError && error.code === "WEBHOOK_SIGNATURE_MISSING"
    );

    await assert.rejects(
      () =>
        handleBillingWebhook({
          rawBody: "{}",
          headers: { "stripe-signature": "invalid" },
          webhookSecret: "STRIPE_WEBHOOK_SECRET",
          verifier,
          store
        }),
      (error: unknown) =>
        error instanceof BillingError && error.code === "WEBHOOK_SIGNATURE_INVALID"
    );

    await handleBillingWebhook({
      rawBody: "{}",
      headers: { "stripe-signature": "valid-signature" },
      webhookSecret: "STRIPE_WEBHOOK_SECRET",
      verifier,
      store
    });

    assert.equal((await store.getByUserId("user_1"))?.status, "trialing");
  });

  it("stores subscription lifecycle states from mocked billing events", async () => {
    const store = new InMemoryBillingStore();
    await applyBillingEvent(store, checkoutCompleted("active"));

    await applyBillingEvent(store, subscriptionUpdated("trialing"));
    assert.equal((await store.getByUserId("user_1"))?.status, "trialing");

    await applyBillingEvent(store, subscriptionUpdated("active"));
    assert.equal((await store.getByUserId("user_1"))?.status, "active");

    await applyBillingEvent(store, subscriptionUpdated("unpaid"));
    assert.equal((await store.getByUserId("user_1"))?.status, "unpaid");

    await applyBillingEvent(store, {
      type: "invoice.payment_failed",
      data: { stripeCustomerId: "cus_test_user_1", subscriptionId: "sub_test_user_1" }
    });
    assert.equal((await store.getByUserId("user_1"))?.status, "past_due");

    await applyBillingEvent(store, {
      type: "customer.subscription.deleted",
      data: { stripeCustomerId: "cus_test_user_1", subscriptionId: "sub_test_user_1", endedAt: past }
    });
    assert.equal((await store.getByUserId("user_1"))?.status, "canceled");
  });

  it("grants premium only from server-side active or trialing subscription state", async () => {
    const store = new InMemoryBillingStore();
    await applyBillingEvent(store, checkoutCompleted("active"));
    assert.equal(await hasServerEntitlement(store, "user_1", "premium"), true);

    await applyBillingEvent(store, subscriptionUpdated("trialing"));
    assert.equal(await hasServerEntitlement(store, "user_1", "premium"), true);

    await applyBillingEvent(store, subscriptionUpdated("past_due"));
    assert.equal(await hasServerEntitlement(store, "user_1", "premium"), false);
    await assert.rejects(() => requireServerEntitlement(store, "user_1", "premium"));

    await applyBillingEvent(store, subscriptionUpdated("active", past));
    assert.equal(await hasServerEntitlement(store, "user_1", "premium"), false);
  });

  it("renders a billing UI stub from stored server state", async () => {
    const store = new InMemoryBillingStore();
    await applyBillingEvent(store, checkoutCompleted("active"));

    const html = renderBillingSettings(await store.getByUserId("user_1"));

    assert.match(html, /<h1>Billing<\/h1>/);
    assert.match(html, /active/);
    assert.match(html, /\/api\/billing\/checkout/);
    assert.match(html, /\/api\/billing\/portal/);
  });
});

function checkoutCompleted(
  status: "trialing" | "active",
  currentPeriodEnd = future
): BillingEvent {
  return {
    type: "checkout.session.completed",
    data: {
      userId: "user_1",
      email: "buyer@example.test",
      stripeCustomerId: "cus_test_user_1",
      subscriptionId: "sub_test_user_1",
      priceId: "STRIPE_PRICE_PRO",
      status,
      currentPeriodEnd
    }
  };
}

function subscriptionUpdated(
  status: "trialing" | "active" | "past_due" | "canceled" | "unpaid",
  currentPeriodEnd = future
): BillingEvent {
  return {
    type: "customer.subscription.updated",
    data: {
      stripeCustomerId: "cus_test_user_1",
      subscriptionId: "sub_test_user_1",
      priceId: "STRIPE_PRICE_PRO",
      status,
      currentPeriodEnd
    }
  };
}
