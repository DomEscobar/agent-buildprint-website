import { defineConfig } from 'astro/config';

export default defineConfig({
  site: process.env.SITE_URL || 'https://agent-buildprint.com',
  output: 'static',
});
