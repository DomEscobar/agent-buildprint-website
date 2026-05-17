import { BillingError } from "./errors.js";
import type { BillingProvider } from "./provider.js";
import type { BillingStore } from "./store.js";
import type {
  BillingCustomer,
  CheckoutSessionRequest,
  CheckoutSessionResult,
  PortalSessionResult
} from "./types.js";

export class BillingService {
  constructor(
    private readonly store: BillingStore,
    private readonly provider: BillingProvider
  ) {}

  async createCheckoutSession(request: CheckoutSessionRequest): Promise<CheckoutSessionResult> {
    requireAuthenticatedUser(request.userId);
    if (!request.priceId) {
      throw new BillingError("A server-selected price id is required", "PRICE_REQUIRED");
    }

    const session = await this.provider.createCheckoutSession(request);
    const existing = await this.store.getByUserId(request.userId);

    await this.store.upsertCustomer({
      userId: request.userId,
      email: request.email,
      stripeCustomerId: session.stripeCustomerId,
      subscriptionId: existing?.subscriptionId,
      priceId: existing?.priceId,
      status: existing?.status ?? "none",
      currentPeriodEnd: existing?.currentPeriodEnd,
      updatedAt: new Date()
    });

    return session;
  }

  async createCustomerPortalSession(
    userId: string,
    returnUrl: string
  ): Promise<PortalSessionResult> {
    requireAuthenticatedUser(userId);
    const customer = await this.store.getByUserId(userId);
    if (!customer?.stripeCustomerId) {
      throw new BillingError("No billing customer exists for this user", "CUSTOMER_REQUIRED");
    }

    return this.provider.createCustomerPortalSession({
      userId,
      stripeCustomerId: customer.stripeCustomerId,
      returnUrl
    });
  }

  async getBillingState(userId: string): Promise<BillingCustomer | undefined> {
    requireAuthenticatedUser(userId);
    return this.store.getByUserId(userId);
  }
}

function requireAuthenticatedUser(userId: string): void {
  if (!userId) {
    throw new BillingError("Authenticated user is required", "AUTH_REQUIRED");
  }
}
