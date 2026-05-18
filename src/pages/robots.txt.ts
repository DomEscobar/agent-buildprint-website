import { siteBase } from '@/lib/buildprints';

export const GET = () => new Response(`User-agent: *\nAllow: /\n\nSitemap: ${siteBase}/sitemap.xml\n`, {
  headers: { 'Content-Type': 'text/plain; charset=utf-8' },
});
