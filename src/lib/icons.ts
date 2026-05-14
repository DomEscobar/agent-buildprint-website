export const iconLabel: Record<string, string> = {
  typescript: 'TS',
  openclaw: 'OC',
  json: '{}',
  docker: '▣',
  astro: 'A',
  md: 'md',
  stripe: '$',
};

export const iconSrc: Record<string, string> = {
  openclaw: 'https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/openclaw-dark.png',
  typescript: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
  docker: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg',
  astro: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/astro/astro-original.svg',
  stripe: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/stripe.svg',
};

export function iconHtml(key: string) {
  return iconSrc[key]
    ? `<img src="${iconSrc[key]}" alt="${key}" loading="lazy" />`
    : iconLabel[key] ?? key.slice(0, 2);
}

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
