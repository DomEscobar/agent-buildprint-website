import { buildprints, siteBase } from '@/lib/buildprints';

const staticPages = ['/', '/about/', '/docs/', '/standard/', '/buildprints/', '/buildprints/submit/', '/llms.txt'];
const buildprintPages = buildprints.map((bp) => `/buildprints/${bp.slug}/`);
const urls = [...staticPages, ...buildprintPages];

export const GET = () => new Response(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((path) => `  <url><loc>${siteBase}${path}</loc></url>`).join('\n')}
</urlset>
`, {
  headers: { 'Content-Type': 'application/xml; charset=utf-8' },
});
