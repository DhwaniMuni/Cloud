# IGNITE 2026

A static portfolio site documenting what I learned in the IGNITE 2026 early-career
technology program, organised **by topic** rather than by week. An overview page,
one page per topic, and a skills index derived from topic frontmatter.

Built with [Astro](https://astro.build) and MDX. No UI framework, no CMS, no
runtime services — the output is plain static files.

## Running it

```bash
npm install
npm run dev      # http://localhost:4321
```

| Script                | What it does                                   |
| --------------------- | ---------------------------------------------- |
| `npm run dev`         | Dev server with hot reload                     |
| `npm run build`       | Static build into `dist/`                      |
| `npm run preview`     | Serve the built site locally                   |
| `npm run check`       | `astro check` — types and template diagnostics |
| `npm run check:links` | Verify internal links and anchors in `dist/`   |
| `npm run format`      | Prettier over the repo                         |

`check:links` runs against a build, so run `npm run build` first.

## Adding or editing a topic

Each topic is one file in [src/content/topics/](src/content/topics/).
**Everything a topic says lives in that file** — there is no component or TS file
to touch. Edit the frontmatter and the body, and the home page list, the tab bar,
the tool chips, the skills page, and the prev/next links all update themselves.

The filename becomes the route: `api-endpoints.mdx` is served at
`/topic/api-endpoints`. The `order` field controls where it sits in the tab bar
and the home page list — not the filename.

### Frontmatter fields

Validated by a Zod schema in [src/content.config.ts](src/content.config.ts). Bad
content fails the build rather than rendering wrong.

```yaml
order: 1 # must be unique; sets tab order and prev/next
title: 'API endpoints: how a URL becomes running code'
tab: 'API endpoints' # tab bar label; keep it short (max 20 chars)
hook: 'One line, shown on the home page. Max 200 chars.'
goal: 'One short paragraph: what you set out to do.'

tools: # must all exist in src/data/tools.ts; at least one
  - Spring Boot
  - Amazon DynamoDB

keyTerms: # definitions panel, rendered before the body
  - term: Payload
    definition: 'The body of the request — the data itself, not the address.'

challenges: # problem/solution pairs; omit or leave [] to hide the section
  - title: 'Short title'
    problem: 'What went wrong.'
    solution: 'How you fixed it.'

learned: # bulleted takeaways
  - 'A takeaway.'

artifacts: # kind is one of: repo | pr | doc | demo
  - label: 'Service repo'
    url: 'https://github.com/you/repo'
    kind: repo

images: # optional; alt text is required and cannot be empty
  - src: '/images/api-endpoints/postman.png'
    alt: 'A Postman DELETE request returning 204 No Content.'
    caption: 'Optional caption.'

featured: false # at most one topic may be true; it gets the "Start here" callout
draft: true # default. true shows a "WIP" badge; set false when the topic is done
```

**Sections with no content are omitted entirely.** An empty `challenges` list
means no "Challenges" heading, and no entry for it in the on-this-page rail.

### Section order on a topic page

1. Header — title, hook, tool chips
2. What I set out to do — `goal`
3. Key terms — `keyTerms`
4. How it works — the MDX body
5. Challenges & how I solved them — `challenges`
6. What I learned — `learned`
7. Artifacts — `artifacts` and `images`

### The body

Everything after the frontmatter becomes the "How it works" section. Use `##` and
`###` headings freely — the sticky on-this-page rail is generated from them at
build time.

These components are available; import them at the top of the body:

```mdx
import Callout from '../../components/Callout.astro';
import PipelineDiagram from '../../components/PipelineDiagram.astro';
import ArchitectureDiagram from '../../components/ArchitectureDiagram.astro';

<Callout variant="insight" title="Optional title">
  Variants: `note`, `warning`, `insight`.
</Callout>

<PipelineDiagram
  caption="Shown below the diagram."
  stages={[
    { label: 'Build', detail: 'Optional second line', icon: '▢' },
    { label: 'Deploy', detail: 'Wraps to vertical on mobile' },
  ]}
/>

<ArchitectureDiagram
  caption="Shown below the figure."
  alt="A text equivalent of the diagram, for screen readers."
>
  <svg viewBox="0 0 720 200" role="presentation">
    ...
  </svg>
</ArchitectureDiagram>
```

Fenced code blocks get a language label, a copy button, and horizontal scrolling
automatically — just use a language tag:

````md
```java
@GetMapping("/{resourceId}")
```
````

### Where images go

Put them in `public/images/<topic-slug>/` and reference them from the repo root:

```yaml
images:
  - src: '/images/api-endpoints/postman.png'
    alt: 'Describe what the image shows, not its filename.'
```

Paths are automatically prefixed with the deployment `base`, so write them as
`/images/...` and they resolve correctly both locally and on GitHub Pages. The
same applies in MDX bodies — but there, prefer `<ArchitectureDiagram>` so the
image gets a proper `figure`/`figcaption`.

### Registering a new tool

A tool must exist in [src/data/tools.ts](src/data/tools.ts) before a topic can
reference it. Add one entry:

```ts
'Amazon SQS': { category: 'Cloud', docs: 'https://docs.aws.amazon.com/sqs/' },
```

Categories are `Cloud`, `DevOps`, `GenAI`, `Backend`, `Frontend`, `Practices`.
`docs` is optional; when present, the tool name on `/skills` links to it.

Referencing an unregistered tool is a **build error** listing every valid name —
that is deliberate, so a typo can't produce a silently miscategorised chip.

The `/skills` page is generated from the union of every topic's `tools`, grouped
by category, with each tool linked to the topics it appeared in. Never edit it by
hand. Registry entries no topic references simply don't appear.

## Design notes

Design tokens — color, spacing, type scale, radii, motion — all live in
[src/styles/theme.css](src/styles/theme.css) as CSS custom properties. Component
styles reference tokens rather than raw values; if you need something that isn't
there, add a token.

Both themes are first-class. The site follows `prefers-color-scheme` and offers a
manual toggle persisted to `localStorage`; a small blocking inline script in
[BaseLayout.astro](src/layouts/BaseLayout.astro) applies the theme before first
paint so there is no flash of the wrong one.

## Deployment

Not wired up yet — the site builds to static files in `dist/`, which any static
host will serve.

The two values that control URLs are at the top of
[astro.config.mjs](astro.config.mjs):

```js
const SITE = 'https://USERNAME.github.io'; // TODO: your Pages origin
const BASE = env?.GITHUB_ACTIONS ? '/ignite-2026' : '/';
```

`BASE` is conditional so local builds serve from the root
(`/topic/api-endpoints`) while CI builds get the repo prefix Pages needs
(`/ignite-2026/topic/api-endpoints`). To reproduce a production build locally, set
the variable yourself — on **both** commands, since the link checker reads `base`
from the same config:

```bash
GITHUB_ACTIONS=true npm run build
GITHUB_ACTIONS=true npm run check:links
```

**Using a custom domain instead?** Set `SITE` to the domain
(`https://example.com`) and `BASE` to `'/'` unconditionally, then add a
`public/CNAME` file containing just the domain. Every internal link drops the
repo prefix automatically — links are built through the helpers in
[src/lib/paths.ts](src/lib/paths.ts), so nothing else needs changing.

Always build internal links with those helpers (`path()`, `topicPath()`) rather
than writing `href="/skills"` directly. A bare root-relative link works in dev
and 404s under a base path.

## Repo layout

```
src/
  content/topics/    one .mdx file per topic — the only place content lives
  content.config.ts  Zod schema; validates frontmatter at build time
  data/
    tools.ts         tools registry: category + optional docs URL
    site.ts          your name, program name, hero summary
  components/        TabBar, TopicCard, ToolChip, KeyTerms, Callout, diagrams, …
  layouts/           BaseLayout (shell, theme script), TopicLayout (topic shell)
  lib/               path helpers, topic data access, Shiki transformer
  pages/
    index.astro      overview + topic list
    skills.astro     derived skills index
    topic/[...slug].astro   one page per topic
  styles/theme.css   every design token
scripts/
  check-links.mjs    internal link checker (Node built-ins only)
public/              static assets, served from the root
```

## What's tracked

[CONTENT_TODO.md](CONTENT_TODO.md) tracks which topics are written and what
placeholder URLs still need replacing.
