/**
 * Shiki transformers used by astro.config.mjs.
 *
 * Kept as a Shiki transformer rather than a rehype plugin so no extra
 * hast/unist dependency is needed — Shiki is already in the build.
 */

/** Friendly names for the language label shown on each code block. */
const LANGUAGE_LABELS = {
  bash: 'Bash',
  sh: 'Shell',
  shell: 'Shell',
  console: 'Shell',
  js: 'JavaScript',
  javascript: 'JavaScript',
  jsx: 'JSX',
  ts: 'TypeScript',
  typescript: 'TypeScript',
  tsx: 'TSX',
  json: 'JSON',
  jsonc: 'JSON',
  yaml: 'YAML',
  yml: 'YAML',
  toml: 'TOML',
  dockerfile: 'Dockerfile',
  docker: 'Dockerfile',
  java: 'Java',
  python: 'Python',
  py: 'Python',
  sql: 'SQL',
  html: 'HTML',
  css: 'CSS',
  astro: 'Astro',
  mdx: 'MDX',
  md: 'Markdown',
  markdown: 'Markdown',
  hcl: 'HCL',
  terraform: 'Terraform',
  xml: 'XML',
  diff: 'Diff',
  text: 'Text',
  plaintext: 'Text',
};

/**
 * Tags each <pre> with `data-language` (a display label) so CSS can render the
 * label, and marks it for the copy-button script to pick up.
 */
export function transformerCodeMeta() {
  return {
    name: 'ignite:code-meta',
    pre(node) {
      const lang = this.options.lang ?? 'text';
      if (lang === 'text' || lang === 'plaintext') return;
      node.properties['data-language'] = LANGUAGE_LABELS[lang] ?? lang;
    },
  };
}
