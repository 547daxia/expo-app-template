# Documentation Site

This directory contains the Astro/Starlight source for the browsable documentation site.

The operational project documentation is maintained as plain Markdown in [`../documentation/`](../documentation/). Start there when you need repository structure, environment, UI ownership, testing, or release instructions. Starlight topic routes are compatibility links to that canonical source; do not duplicate operational guidance in both places.

## Project Structure

Inside this documentation site you will find:

```
.
├── public/
├── src/
│   ├── assets/
│   ├── content/docs/
│   └── styles/
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

Starlight exposes `.md` and `.mdx` files in `src/content/docs/` as site routes.

## Commands

Run these commands from this directory:

| Command | Action |
| --- | --- |
| `pnpm install` | Install documentation dependencies |
| `pnpm dev` | Start the local site |
| `pnpm build` | Build the documentation site |
| `pnpm preview` | Preview the production build |

## Learn more

Read [Starlight's docs](https://starlight.astro.build/) or [the Astro documentation](https://docs.astro.build/).

When deploying this site for a fork, set `PUBLIC_DOCUMENTATION_REPOSITORY` and `PUBLIC_DOCUMENTATION_BRANCH` so the project documentation link resolves to the correct repository and branch.
