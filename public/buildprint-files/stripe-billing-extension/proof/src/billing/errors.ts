export class BillingError extends Error {
  constructor(
    message: string,
    readonly code: string
  ) {
    super(message);
    this.name = "BillingError";
  }
}

export class EntitlementError extends BillingError {
  constructor(message = "Premium entitlement required") {
    super(message, "ENTITLEMENT_REQUIRED");
    this.name = "EntitlementError";
  }
}
