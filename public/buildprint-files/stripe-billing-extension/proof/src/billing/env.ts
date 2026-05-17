export const billingEnvNames = {
  stripeSecretKey: "STRIPE_SECRET_KEY",
  stripeWebhookSecret: "STRIPE_WEBHOOK_SECRET",
  stripePricePro: "STRIPE_PRICE_PRO",
  successUrl: "APP_BILLING_SUCCESS_URL",
  cancelUrl: "APP_BILLING_CANCEL_URL",
  portalReturnUrl: "APP_BILLING_PORTAL_RETURN_URL"
} as const;
