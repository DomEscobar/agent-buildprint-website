import type { BillingCustomer, SubscriptionStatus } from "./types.js";

export interface BillingStore {
  getByUserId(userId: string): Promise<BillingCustomer | undefined>;
  getByStripeCustomerId(stripeCustomerId: string): Promise<BillingCustomer | undefined>;
  upsertCustomer(customer: BillingCustomer): Promise<BillingCustomer>;
  updateSubscriptionByStripeCustomerId(
    stripeCustomerId: string,
    patch: {
      subscriptionId?: string;
      priceId?: string;
      status: SubscriptionStatus;
      currentPeriodEnd?: Date;
    }
  ): Promise<BillingCustomer>;
}

export class InMemoryBillingStore implements BillingStore {
  private readonly byUserId = new Map<string, BillingCustomer>();
  private readonly stripeCustomerToUser = new Map<string, string>();

  async getByUserId(userId: string): Promise<BillingCustomer | undefined> {
    return cloneCustomer(this.byUserId.get(userId));
  }

  async getByStripeCustomerId(stripeCustomerId: string): Promise<BillingCustomer | undefined> {
    const userId = this.stripeCustomerToUser.get(stripeCustomerId);
    return userId ? this.getByUserId(userId) : undefined;
  }

  async upsertCustomer(customer: BillingCustomer): Promise<BillingCustomer> {
    const normalized = cloneCustomer({
      ...customer,
      updatedAt: customer.updatedAt ?? new Date()
    });
    if (!normalized) {
      throw new Error("Customer is required");
    }
    this.byUserId.set(normalized.userId, normalized);
    this.stripeCustomerToUser.set(normalized.stripeCustomerId, normalized.userId);
    return cloneCustomer(normalized)!;
  }

  async updateSubscriptionByStripeCustomerId(
    stripeCustomerId: string,
    patch: {
      subscriptionId?: string;
      priceId?: string;
      status: SubscriptionStatus;
      currentPeriodEnd?: Date;
    }
  ): Promise<BillingCustomer> {
    const current = await this.getByStripeCustomerId(stripeCustomerId);
    if (!current) {
      throw new Error(`No local customer for Stripe customer ${stripeCustomerId}`);
    }

    return this.upsertCustomer({
      ...current,
      ...patch,
      currentPeriodEnd: patch.currentPeriodEnd ?? current.currentPeriodEnd,
      updatedAt: new Date()
    });
  }
}

function cloneCustomer(customer: BillingCustomer | undefined): BillingCustomer | undefined {
  if (!customer) {
    return undefined;
  }

  return {
    ...customer,
    currentPeriodEnd: customer.currentPeriodEnd
      ? new Date(customer.currentPeriodEnd)
      : undefined,
    updatedAt: new Date(customer.updatedAt)
  };
}
