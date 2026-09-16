import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  integrations: [tailwind()],
  output: 'server',
  adapter: cloudflare({
    mode: 'directory'
  }),
  site: 'https://app.mescriptlabs.workers.dev',
  compress: true,
  build: {
    inlineStylesheets: 'auto'
  }
});
