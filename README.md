# kb — the support knowledge base

**kb** = knowledge base. What the support desk knows about how our products break, written
down where the code can keep it honest.

One desk takes reports for every product we run: `sched-prod` (calendar invites for about
300k people) and the rest. When something
goes wrong, the reports reach the desk first. This kb is how the desk triages them, what each
incident turned out to be, and why we decided what we decided.

## What's here

```
src/routes/kb/      the pages (.svx: Markdown with components)
  triage/           how the desk handles incoming reports
  incidents/        one page per big ticket
  decisions/        numbered decision records
src/lib/kb/         components and the logic they run
src/lib/layouts/    the frame every page shares
src/lib/data/       exports from the ticket system
```

## Conventions

- Words in the page, logic in `src/lib` (imported as `#lib/…`). A number that can be computed belongs in a component.
- Every page starts with frontmatter: `title`, `owner`, `status`, `reviewed`.
- A decision is never edited after it is accepted. A new record replaces it.
- A page you add is signed: its frontmatter carries your `signature` and it ends with `<RenderStamp {signature} />`, so the desk knows who wrote it.

## Owners

Support desk. Decision records: whoever signed them.

## Building

```
pnpm install
pnpm build        # every page as plain HTML in build/
```

`vite.config.js` is the smallest SvelteKit + mdsvex setup that renders these pages. It was added
to this export so the pages can be checked; the `support` repo has its own build.

## #4471 split (added 2026-11-08)

- Page: `src/routes/kb/incidents/4471-split/+page.svx`, signed `Carlos Ortega`.
- As the desk sees it: `rendered/4471-split.html` (one file, CSS inlined). The updated incident: `rendered/4471.html`.
- Logic: `src/lib/kb/split-4471.ts` and `src/lib/kb/SplitTable.svelte`.
- One GitHub issue per problem in this repo: #1 `parser`, #2 `hint`. (#3 `one-day` was closed: the desk counts those 5 under `parser`.)
- How the reports were checked: `analysis/`.

---

Exported 2026-10-04 from the `support` repo, `apps/kb/` → `src/`.
