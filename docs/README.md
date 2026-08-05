# Documentation Site

`documentation/` is the canonical operational source. This Astro/Starlight
project is a presentation layer: its prebuild script copies canonical Markdown
into the site content tree for navigation, search, and `llms.txt` generation.
Do not hand-copy operational guidance into `docs/src/content/docs/`.

## Commands

Run from this directory:

| Command | Action |
| --- | --- |
| `pnpm install` | Install site dependencies |
| `pnpm dev` | Sync canonical docs and start the local site |
| `pnpm build` | Sync canonical docs and build the static site |
| `pnpm preview` | Preview the production build |

Use `pnpm docs:check` at the repository root to validate canonical local links.

Set `PUBLIC_DOCUMENTATION_SITE` when deploying. Set
`PUBLIC_DOCUMENTATION_REPOSITORY` and `PUBLIC_DOCUMENTATION_BRANCH` only when
you want generated code-path links to target a specific Git repository and
branch. Without repository metadata, the site keeps those paths as text rather
than linking to the source template.
