# Content checklist

Tracks which weeks are written. A week is **done** when `draft: false` — that is
what removes the "WIP" badge from the timeline and the week page.

| Week | Title                                    | File                                  | Status |
| ---- | ---------------------------------------- | ------------------------------------- | ------ |
| 1    | Onboarding and the shape of the system   | [week-01-onboarding.mdx][w1]          | ☐ TODO |
| 2    | Backend foundations: APIs and data       | [week-02-backend-foundations.mdx][w2] | ☐ TODO |
| 3    | Cloud fundamentals on AWS                | [week-03-cloud-fundamentals.mdx][w3]  | ☐ TODO |
| 4    | Frontend: building the client            | [week-04-frontend.mdx][w4]            | ☐ TODO |
| 5    | DevOps: CI/CD end to end                 | [week-05-devops.mdx][w5]              | ☑ Done |
| 6    | GenAI foundations: prompts and retrieval | [week-06-genai-foundations.mdx][w6]   | ☐ TODO |
| 7    | Capstone prep: scoping and spikes        | [week-07-capstone-prep.mdx][w7]       | ☐ TODO |
| 8    | Capstone: agentic RAG on Amazon Bedrock  | [week-08-capstone.mdx][w8]            | ☑ Done |

[w1]: src/content/weeks/week-01-onboarding.mdx
[w2]: src/content/weeks/week-02-backend-foundations.mdx
[w3]: src/content/weeks/week-03-cloud-fundamentals.mdx
[w4]: src/content/weeks/week-04-frontend.mdx
[w5]: src/content/weeks/week-05-devops.mdx
[w6]: src/content/weeks/week-06-genai-foundations.mdx
[w7]: src/content/weeks/week-07-capstone-prep.mdx
[w8]: src/content/weeks/week-08-capstone.mdx

## Per-week checklist

For each week, work through:

- [ ] `title` and `hook` say something specific — the hook is the one line on the timeline
- [ ] `startDate` / `endDate` are correct
- [ ] `goal` is one paragraph about the intended outcome, not a list of activities
- [ ] `tools` are all registered in [src/data/tools.ts](src/data/tools.ts)
- [ ] `challenges` — real problem/solution pairs, with the actual cause named
- [ ] `learned` — takeaways you'd give someone starting the same week
- [ ] `artifacts` — real URLs (the placeholders point at `USERNAME/REPO`)
- [ ] Body prose replaces every `TODO`
- [ ] `draft: false`

## Placeholder URLs still to replace

The written weeks (5 and 8) carry placeholder artifact links pointing at
`https://github.com/USERNAME/REPO`. Search for `USERNAME/REPO` and replace with
real URLs, or drop the entries.

Also in the written weeks: the `ArchitectureDiagram` bodies contain placeholder
SVGs marked with a `TODO` comment. Replace them with real diagrams and update the
`alt` text to describe what the final diagram actually shows.
