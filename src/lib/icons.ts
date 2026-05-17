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
