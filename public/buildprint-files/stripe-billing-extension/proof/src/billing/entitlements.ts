import { EntitlementError } from "./errors.js";
import type { BillingStore } from "./store.js";
import type { Entitlement } from "./types.js";

const entitledStatuses = new Set(["active", "trialing"]);

export async function hasServerEntitlement(
  store: BillingStore,
  userId: string,
  entitlement: Entitlement,
  now = new Date()
): Promise<boolean> {
  if (entitlement !== "premium") {
    return false;
  }

  const customer = await store.getByUserId(userId);
  if (!customer || !entitledStatuses.has(customer.status)) {
    return false;
  }

  if (!customer.currentPeriodEnd) {
    return true;
  }

  return customer.currentPeriodEnd.getTime() > now.getTime();
}

export async function requireServerEntitlement(
  store: BillingStore,
  userId: string,
  entitlement: Entitlement,
  now = new Date()
): Promise<void> {
  if (!(await hasServerEntitlement(store, userId, entitlement, now))) {
    throw new EntitlementError();
  }
}
