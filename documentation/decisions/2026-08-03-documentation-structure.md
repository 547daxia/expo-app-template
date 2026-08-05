# Documentation structure

- **Status:** accepted
- **Decision:** keep operational guidance as plain Markdown under
  `documentation/`, with `README.md` as the task-oriented index and dated
  records under `decisions/`.
- **Reason:** Markdown is readable from a checkout, reviewable with code, and
  usable by coding agents. The Starlight site imports this source during build
  instead of maintaining a second operational copy.
- **Scope:** architecture, development, configuration, app behavior, quality,
  release, and optional implementation recipes belong in the canonical tree.
  Public overview and marketing pages may remain in `docs/`.
- **Consequences:** a behavior change updates one canonical page. Starlight
  routes and legacy redirects are presentation concerns; generated output is
  not edited.
- **Owner:** repository maintainers.
