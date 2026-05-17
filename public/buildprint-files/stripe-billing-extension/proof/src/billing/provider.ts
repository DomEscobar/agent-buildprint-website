import type {
  CheckoutSessionRequest,
  CheckoutSessionResult,
  PortalSessionRequest,
  PortalSessionResult
} from "./types.js";

export interface BillingProvider {
  createCheckoutSession(request: CheckoutSessionRequest): Promise<CheckoutSessionResult>;
  createCustomerPortalSession(request: PortalSessionRequest): Promise<PortalSessionResult>;
}

export class MockBillingProvider implements BillingProvider {
  readonly checkoutRequests: CheckoutSessionRequest[] = [];
  readonly portalRequests: PortalSessionRequest[] = [];

  async createCheckoutSession(request: CheckoutSessionRequest): Promise<CheckoutSessionResult> {
    this.checkoutRequests.push({ ...request });
    const suffix = stableId(request.userId);
    return {
      id: `cs_test_${suffix}_${this.checkoutRequests.length}`,
      url: `https://billing.local/checkout/${suffix}`,
      stripeCustomerId: `cus_test_${suffix}`
    };
  }

  async createCustomerPortalSession(request: PortalSessionRequest): Promise<PortalSessionResult> {
    this.portalRequests.push({ ...request });
    return {
      id: `bps_test_${stableId(request.userId)}_${this.portalRequests.length}`,
      url: `https://billing.local/portal/${request.stripeCustomerId}`
    };
  }
}

function stableId(input: string): string {
  return input.replace(/[^a-zA-Z0-9]/g, "_").slice(0, 32) || "user";
}
