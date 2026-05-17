export function badgeIcon(value: string) {
  if (value.includes('Product')) return '◈';
  if (value.includes('Feature')) return '＋';
  if (value.includes('Framework')) return '⌘';
  if (value.includes('Workflow')) return '↻';
  if (value.includes('Mapped')) return '⌁';
  if (value.includes('agent-grade')) return '◆';
  if (value.includes('strong')) return '◇';
  if (value.includes('basic')) return '○';
  if (value.includes('dry-run')) return '△';
  if (value.includes('coming')) return '…';
  if (value.includes('validated')) return '✓';
  return '•';
}
