# IGNITE 2026

A static portfolio site documenting eight weeks in the IGNITE 2026 early-career
technology program. Ten pages: an overview timeline, one page per week, and a
skills index derived from week frontmatter.

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

## Adding or editing a week

Each week is one file in [src/content/weeks/](src/content/weeks/). **Everything a
week says lives in that file** — there is no component or TS file to touch. Edit
the frontmatter and the body, and the timeline, tool chips, skills page, and
prev/next links all update themselves.

The filename does not matter. The route comes from the `week` number in
frontmatter, so `/week/5` stays `/week/5` no matter what you call the file.

### Frontmatter fields

Validated by a Zod schema in [src/content.config.ts](src/content.config.ts). Bad
content fails the build rather than rendering wrong.

```yaml
week: 5 # 1–8, must be unique across files
title: 'DevOps: CI/CD end to end'
hook: 'One line, shown on the timeline. Max 200 chars.'
startDate: 2026-07-06 # YYYY-MM-DD
endDate: 2026-07-11 # must be >= startDate
goal: 'One short paragraph: what the week was for.'

tools: # must all exist in src/data/tools.ts
  - Docker
  - Amazon ECS

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
  - src: '/images/week-5/pipeline.png'
    alt: 'The CodePipeline console showing four green stages.'
    caption: 'Optional caption.'

draft: true # default. true shows a "WIP" badge; set false when the week is done
```

**Sections with no content are omitted entirely.** An empty `challenges` list
means no "Challenges" heading, and no entry for it in the on-this-page rail.

### The body

Everything after the frontmatter is the "What I worked on" section. Use `##` and
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
```dockerfile
FROM eclipse-temurin:21-jre-alpine
```
````

### Where images go

Put them in `public/images/week-<n>/` and reference them from the repo root:

```yaml
images:
  - src: '/images/week-5/pipeline.png'
    alt: 'Describe what the image shows, not its filename.'
```

Paths are automatically prefixed with the deployment `base`, so write them as
`/images/...` and they resolve correctly both locally and on GitHub Pages. The
same applies in MDX bodies — but there, prefer `<ArchitectureDiagram>` so the
image gets a proper `figure`/`figcaption`.

### Registering a new tool

A tool must exist in [src/data/tools.ts](src/data/tools.ts) before a week can
reference it. Add one entry:

```ts
'Amazon SQS': { category: 'Cloud', docs: 'https://docs.aws.amazon.com/sqs/' },
```

Categories are `Cloud`, `DevOps`, `GenAI`, `Backend`, `Frontend`, `Practices`.
`docs` is optional; when present, the tool name on `/skills` links to it.

Referencing an unregistered tool is a **build error** listing every valid name —
that is deliberate, so a typo can't produce a silently miscategorised chip.

The `/skills` page is generated from the union of every week's `tools`, grouped by
category, with each tool linked to the weeks it appeared in. Never edit it by
hand. Registry entries no week references simply don't appear.

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
const BASE = process.env.GITHUB_ACTIONS ? '/ignite-2026' : '/';
```

`BASE` is conditional so local builds serve from the root (`/week/5`) while CI
builds get the repo prefix Pages needs (`/ignite-2026/week/5`). To reproduce a
production build locally, set the variable yourself:

```bash
GITHUB_ACTIONS=true npm run build && npm run check:links
```

**Using a custom domain instead?** Set `SITE` to the domain
(`https://example.com`) and `BASE` to `'/'` unconditionally, then add a
`public/CNAME` file containing just the domain. Every internal link drops the
repo prefix automatically — links are built through the helpers in
[src/lib/paths.ts](src/lib/paths.ts), so nothing else needs changing.

Always build internal links with those helpers (`path()`, `weekPath()`) rather
than writing `href="/skills"` directly. A bare root-relative link works in dev
and 404s under a base path.

## Repo layout

```
src/
  content/weeks/     one .mdx file per week — the only place content lives
  content.config.ts  Zod schema; validates frontmatter at build time
  data/
    tools.ts         tools registry: category + optional docs URL
    site.ts          your name, program name, hero summary
  components/        TabBar, Timeline, ToolChip, Callout, diagrams, …
  layouts/           BaseLayout (shell, theme script), WeekLayout (week shell)
  lib/               path helpers, date formatting, week data access
  pages/
    index.astro      overview timeline
    skills.astro     derived skills index
    week/[...slug].astro   one page per week
  styles/theme.css   every design token
scripts/
  check-links.mjs    internal link checker (Node built-ins only)
public/              static assets, served from the root
```

## What's tracked

[CONTENT_TODO.md](CONTENT_TODO.md) tracks which weeks are written. Weeks 5 and 8
are done; the rest are structured placeholders.
