import { defineConfig } from 'astro/config';

// NOTE: replace "your-username" with your GitHub username/org below, and
// update `base` to match your repository name if it differs from "donchie".
export default defineConfig({
  output: 'static',
  site: 'https://your-username.github.io',
  base: '/donchie',
});
