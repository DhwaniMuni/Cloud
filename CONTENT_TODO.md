# Content checklist

Tracks which topics are written. A topic is **done** when `draft: false` — that is
what removes the "WIP" badge from the home page and the topic page.

| #   | Topic                                         | File                    | Status |
| --- | --------------------------------------------- | ----------------------- | ------ |
| 1   | API endpoints: how a URL becomes running code | [api-endpoints.mdx][t1] | ☑ Done |

[t1]: src/content/topics/api-endpoints.mdx

## Next topics

The site is organised by topic, not by week, so topics get added as they are
decided — there are no placeholder files waiting to be filled in. To add one,
create a file in [src/content/topics/](src/content/topics/) following the schema
in [README.md](README.md#frontmatter-fields).

## Per-topic checklist

For each topic, work through:

- [ ] `title` and `hook` say something specific — the hook is the one line on the home page
- [ ] `tab` is short enough to read in the tab bar (max 20 chars)
- [ ] `order` is unique across every topic; it sets both the tab order and prev/next
- [ ] `goal` is one paragraph about the intended outcome, not a list of activities
- [ ] `keyTerms` define every piece of jargon the body uses, before it is used
- [ ] `tools` are all registered in [src/data/tools.ts](src/data/tools.ts)
- [ ] `challenges` — real problem/solution pairs, with the actual cause named
- [ ] `learned` — takeaways you'd give someone starting from zero
- [ ] `artifacts` — real URLs (placeholders point at `USERNAME/...`)
- [ ] Body prose replaces every `TODO`
- [ ] `draft: false`

## Placeholder URLs still to replace

`api-endpoints.mdx` carries artifact links pointing at
`https://github.com/USERNAME/resourcehub`. Search for `USERNAME` and replace with
the real URLs, or drop the entries.

Also: `SITE` in [astro.config.mjs](astro.config.mjs) is still
`https://USERNAME.github.io`.
