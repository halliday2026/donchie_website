import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  integrations: [sitemap({ lastmod: new Date() })],
  output: 'static',
  site: 'https://donchie.com',
});
