import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [tailwind()],
  output: 'static',
  site: 'https://mescriptlabs.com',
  compress: true,
  build: {
    inlineStylesheets: 'auto'
  }
});
