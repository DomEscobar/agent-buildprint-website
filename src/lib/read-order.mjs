// One publication grammar for prompts and agent guides. Unknown order prose fails
// closed: do not silently append a canonical list beside a competing instruction.
const fileToken = '`?[A-Za-z0-9_-]+(?:/[A-Za-z0-9_.-]+)*\\.(?:md|ya?ml|json)`?';
const sequence = `${fileToken}(?:\\s*(?:->|,\\s*(?:then\\s+)?|then|and)\\s*${fileToken})*`;
const orderSentence = new RegExp(`\\b(?:Read order:\\s*|Read\\s+)${sequence}\\.(?=\\s|$)`, 'gi');
const ambiguousOrder = /\bread\s+order\s*:|\bread\s+(?:the\s+)?(?:package\s+)?files\s+in\b|\bmanifest[- ]order\s+reading\b|\b(?:read|load)\b[^\n!?]*(?:\bthen\b|\bbefore\b|\bafter\b|\bfollowed by\b|->)[^\n!?]*\.(?:md|ya?ml|json)\b/i;

export function resolveReadOrder(explicit, fallback, files) {
  const order = explicit === undefined ? fallback : explicit;
  if (!Array.isArray(order) || !order.length || order.some((file) =>
    typeof file !== 'string' || !/^[A-Za-z0-9_-]+(?:\/[A-Za-z0-9_.-]+)*\.(?:md|ya?ml|json)$/.test(file)
    || file.split('/').includes('..') || (files && !files.includes(file)))
    || new Set(order).size !== order.length) {
    throw new Error('Invalid manifest readOrder: require unique, published relative file paths');
  }
  return [...order];
}

export function formatReadOrder(order) {
  return `Read order: ${resolveReadOrder(order).map((file) => `\`${file}\``).join(' -> ')}.`;
}

export function normalizeCopyPrompt(prompt, order) {
  if (typeof prompt !== 'string' || prompt.includes('\u0000')) throw new Error('copyPrompt must be text');
  const canonical = formatReadOrder(order);
  let found = false;
  const text = prompt.trim().replace(orderSentence, () => {
    if (found) return ''; // Only order sentences are removed; adjacent prose stays intact.
    found = true;
    return '\u0000CANONICAL_READ_ORDER\u0000';
  });
  if (ambiguousOrder.test(text)) {
    throw new Error('Ambiguous copyPrompt read order; use a standalone Read order: `file` -> `file`. sentence');
  }
  return found ? text.replace('\u0000CANONICAL_READ_ORDER\u0000', canonical) : `${canonical}\n\n${text}`.trim();
}

export function assertPromptReadOrder(prompt, order) {
  if (normalizeCopyPrompt(prompt, order) !== prompt.trim()) {
    throw new Error('Published prompt must contain exactly one canonical manifest read order');
  }
}
