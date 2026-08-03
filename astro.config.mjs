// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

// TODO: replace both of these with your own values before deploying.
// `site`  — your GitHub Pages origin: https://<USERNAME>.github.io
// `base`  — the repo name, with a leading slash: '/<REPO_NAME>'
//
// Using a custom domain instead? See the "Deployment" section of README.md —
// you set `site` to the domain and `base` to '/'.
const SITE = 'https://USERNAME.github.io';
const BASE = '/ignite-2026';

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
    },
  },
});
