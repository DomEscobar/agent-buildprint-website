export const iconLabel: Record<string, string> = {
  typescript: 'TS',
  openclaw: 'OC',
  json: '{}',
  docker: '▣',
  astro: 'A',
  markdown: 'md',
  md: 'md',
  stripe: '$',
  openai: 'AI',
  anthropic: 'A',
  cursor: 'C',
  gemini: 'G',
  githubcopilot: 'CP',
  react: 'R',
  vite: 'V',
  nodejs: 'N',
  python: 'Py',
  rails: 'Rb',
  go: 'Go',
  php: 'PHP',
  laravel: 'L',
  langchain: 'LC',
  javascript: 'JS',
  npm: 'npm',
  github: 'GH',
};

export const iconTitle: Record<string, string> = {
  typescript: 'TypeScript',
  openclaw: 'OpenClaw',
  json: 'JSON',
  docker: 'Docker',
  astro: 'Astro',
  markdown: 'Markdown',
  md: 'Markdown',
  stripe: 'Stripe',
  openai: 'OpenAI / Codex',
  anthropic: 'Anthropic / Claude',
  cursor: 'Cursor',
  gemini: 'Google Gemini',
  githubcopilot: 'GitHub Copilot',
  react: 'React',
  vite: 'Vite',
  nodejs: 'Node.js',
  python: 'Python',
  rails: 'Ruby on Rails',
  go: 'Go',
  php: 'PHP',
  laravel: 'Laravel',
  langchain: 'LangChain',
  javascript: 'JavaScript',
  npm: 'npm',
  github: 'GitHub',
};

export const iconSrc: Record<string, string> = {
  openclaw: 'https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/openclaw-dark.png',
  typescript: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
  docker: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg',
  astro: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/astro/astro-original.svg',
  stripe: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/stripe.svg',
  markdown: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/markdown.svg',
  md: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/markdown.svg',
  json: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/json.svg',
  openai: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/openai.svg',
  anthropic: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/anthropic.svg',
  cursor: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/cursor.svg',
  gemini: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/googlegemini.svg',
  githubcopilot: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/githubcopilot.svg',
  react: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
  vite: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vitejs/vitejs-original.svg',
  nodejs: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
  python: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
  rails: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rails/rails-original-wordmark.svg',
  go: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg',
  php: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg',
  laravel: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-original.svg',
  langchain: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/langchain.svg',
  javascript: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/javascript.svg',
  npm: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/npm.svg',
  github: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/github.svg',
};

const iconMatchers: Array<[RegExp, string]> = [
  [/openclaw/i, 'openclaw'],
  [/typescript|\bts\b/i, 'typescript'],
  [/docker/i, 'docker'],
  [/astro/i, 'astro'],
  [/mdx|markdown|\.md\b|\bmd\b/i, 'markdown'],
  [/json/i, 'json'],
  [/stripe/i, 'stripe'],
  [/codex|openai/i, 'openai'],
  [/claude|anthropic/i, 'anthropic'],
  [/cursor/i, 'cursor'],
  [/gemini/i, 'gemini'],
  [/copilot/i, 'githubcopilot'],
  [/react/i, 'react'],
  [/vite/i, 'vite'],
  [/node\.js|nodejs|\bnode\b/i, 'nodejs'],
  [/python/i, 'python'],
  [/rails|ruby on rails/i, 'rails'],
  [/\bgo\b|golang/i, 'go'],
  [/php/i, 'php'],
  [/laravel/i, 'laravel'],
  [/langchain/i, 'langchain'],
  [/javascript|\bjs\b/i, 'javascript'],
  [/\bnpm\b/i, 'npm'],
  [/github/i, 'github'],
];

export function iconKeysForName(name: string) {
  const found: string[] = [];
  for (const [matcher, key] of iconMatchers) {
    if (matcher.test(name) && !found.includes(key)) found.push(key);
  }
  return found;
}

export function iconHtml(key: string) {
  return iconSrc[key]
    ? `<img src="${iconSrc[key]}" alt="" loading="lazy" />`
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

export function registryBadgeIcon(badge: string) {
  const key = badge.toLowerCase();
  if (['official', 'verified', 'buildprint-ready', 'runnable'].includes(key)) return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12.5 4.2 4.2L19 6.8"/></svg>';
  if (key.includes('context') || key.includes('tokens')) return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 7.5h15"/><path d="M4.5 12h15"/><path d="M4.5 16.5h10"/></svg>';
  if (key.includes('agent') || key.includes('workflow')) return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 8.2h8v7.6H8z"/><path d="M12 3.8v3.4"/><path d="M12 16.8v3.4"/><path d="M4.2 12h2.9"/><path d="M16.9 12h2.9"/></svg>';
  if (key.includes('license') || key.includes('updated')) return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4.2h8.2L18 8v11.8H6z"/><path d="M14 4.2V8h4"/><path d="M8.8 12h6.4"/><path d="M8.8 15h5"/></svg>';
  return '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="7.5"/><path d="M12 8v4l2.8 2"/></svg>';
}

export function categoryIcon(category: string, haystack = '') {
  const text = `${category} ${haystack}`.toLowerCase();
  if (category === 'Mapped Project') return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 6.2 9 4.4l6 2.2 4.5-1.8v13l-4.5 1.8-6-2.2-4.5 1.8z"/><path d="M9 4.4v13"/><path d="M15 6.6v13"/><path d="M12 8.4a2.4 2.4 0 0 1 2.4 2.4c0 1.8-2.4 4.3-2.4 4.3s-2.4-2.5-2.4-4.3A2.4 2.4 0 0 1 12 8.4Z"/><circle cx="12" cy="10.8" r=".45"/></svg>';
  if (category === 'Product OS') return '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5" width="16" height="14" rx="2.4"/><path d="M4 9h16"/><path d="M8 13h4.6"/><path d="M8 16h8"/><path d="M8 7h.01"/><path d="M10.4 7h.01"/></svg>';
  if (category === 'Workflow OS' || category === 'Workflow') return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7h6.2a4.8 4.8 0 0 1 0 9.6H10"/><path d="M11.2 4.2 14 7l-2.8 2.8"/><path d="M12.8 19.8 10 17l2.8-2.8"/><path d="M4.5 17H10"/></svg>';
  if (category === 'Feature / Extension') return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8.2 4.5h4.2v3h2.4a2.8 2.8 0 0 1 0 5.6h-2.4v2.4H9.8v-2.4H7.4a2.8 2.8 0 0 1 0-5.6h.8z"/><path d="M12.4 15.5v4h5.1a2 2 0 0 0 2-2v-5.1h-4.7"/></svg>';
  if (category === 'Framework / Architecture' || text.includes('architecture')) return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 19.5h15"/><path d="M6 16V8.6l6-3.4 6 3.4V16"/><path d="M8.4 16v-5.4h7.2V16"/><path d="M12 5.2V16"/><path d="M6 8.6h12"/></svg>';
  if (text.includes('mapper') || text.includes('generator') || text.includes('builder')) return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5.5h5.2v5.2H5z"/><path d="M13.8 13.3H19v5.2h-5.2z"/><path d="M10.2 8.1h2.2a3.5 3.5 0 0 1 3.5 3.5v1.7"/><path d="m17.5 11.8-1.6 1.6-1.6-1.6"/></svg>';
  return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.8v3.1"/><path d="M12 17.1v3.1"/><path d="M3.8 12h3.1"/><path d="M17.1 12h3.1"/><path d="m6.2 6.2 2.2 2.2"/><path d="m15.6 15.6 2.2 2.2"/><path d="m17.8 6.2-2.2 2.2"/><path d="m8.4 15.6-2.2 2.2"/><circle cx="12" cy="12" r="3.5"/></svg>';
}
