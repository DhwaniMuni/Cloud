// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import { transformerCodeMeta } from './src/lib/shiki-transformers.mjs';

// TODO: replace SITE with your GitHub Pages origin: https://<USERNAME>.github.io
// BASE is set automatically: '/' locally, '/ignite-2026' in GitHub Actions.
// Using a custom domain? See the "Deployment" section of README.md —
// set SITE to your domain and BASE to '/'.
const SITE = 'https://USERNAME.github.io';

// `process` is cast through globalThis so `astro check` does not require
// @types/node just for this one lookup.
const env = /** @type {{ env?: Record<string, string | undefined> }} */ (
  /** @type {any} */ (globalThis).process
).env;
const BASE = env?.GITHUB_ACTIONS ? '/ignite-2026' : '/';

export default defineConfig({
  site: SITE,
  base: BASE,
  output: 'static',
  trailingSlash: 'ignore',
  integrations: [mdx()],
  markdown: {
    shikiConfig: {
      // Two themes so code blocks follow the site's light/dark toggle.
      themes: {
        light: 'github-light',
        dark: 'github-dark-dimmed',
      },
      wrap: false,
      transformers: [transformerCodeMeta()],
    },
  },
});
