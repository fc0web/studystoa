import { defineConfig } from 'astro/config';

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  site: 'https://studystoa.pages.dev',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ja'],
    routing: {
      prefixDefaultLocale: false, // /index.astro = English, /ja/index.astro = Japanese
    },
  },
  build: {
    format: 'directory',
  },
  vite: {
    server: {
      fs: {
        // Allow reading rei-aios data during dev (sibling directory)
        allow: ['..', '../rei-aios'],
      },
    },
  },
});
