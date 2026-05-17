import { BillingError } from "./errors.js";
import type { BillingEvent } from "./types.js";

export interface SignatureVerifier {
  verify(
    rawBody: string,
    signatureHeader: string,
    webhookSecret: string
  ): Promise<BillingEvent> | BillingEvent;
}

export class MockSignatureVerifier implements SignatureVerifier {
  constructor(
    private readonly expectedSignature: string,
    private readonly event: BillingEvent
  ) {}

  verify(_rawBody: string, signatureHeader: string, _webhookSecret: string): BillingEvent {
    if (signatureHeader !== this.expectedSignature) {
      throw new BillingError("Invalid webhook signature", "WEBHOOK_SIGNATURE_INVALID");
    }
    return this.event;
  }
}
