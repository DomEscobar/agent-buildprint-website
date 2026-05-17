import type { BillingCustomer } from "../billing/types.js";

export function renderBillingSettings(state: BillingCustomer | undefined): string {
  const status = escapeHtml(state?.status ?? "none");
  const renewsAt = state?.currentPeriodEnd
    ? state.currentPeriodEnd.toISOString()
    : "No active billing period";

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Billing</title>
    <style>
      body { font-family: system-ui, sans-serif; margin: 2rem; color: #17202a; }
      main { max-width: 42rem; }
      .row { display: flex; justify-content: space-between; border-bottom: 1px solid #d7dde3; padding: 0.75rem 0; }
      button { padding: 0.55rem 0.8rem; border: 1px solid #17202a; background: #17202a; color: white; }
      form { display: inline-block; margin-right: 0.5rem; }
    </style>
  </head>
  <body>
    <main>
      <h1>Billing</h1>
      <div class="row"><strong>Status</strong><span>${status}</span></div>
      <div class="row"><strong>Current period</strong><span>${escapeHtml(renewsAt)}</span></div>
      <form method="post" action="/api/billing/checkout">
        <button type="submit">Start checkout</button>
      </form>
      <form method="post" action="/api/billing/portal">
        <button type="submit">Manage billing</button>
      </form>
    </main>
  </body>
</html>`;
}

function escapeHtml(input: string): string {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
