# Documentation structure

- Decision: keep an operational documentation set as plain Markdown under `documentation/`, with `Readme.md` as its index and `decisions/` for dated records.
- Reason: this structure is readable directly from a checkout, easy to review alongside code changes, and matches the repository's maintenance-oriented documentation workflow.
- Scope: architecture, development, configuration, app behavior, testing, and release guidance belong in top-level topic files; durable implementation choices belong in dated decision records.
- Compatibility: the existing Astro/Starlight site under `docs/` remains available as the browsable reference site and is not removed by this change.
- Maintenance: when a behavior changes, update the relevant Markdown page. Change a Starlight compatibility page only when its canonical link or route mapping changes; do not copy the topic content back into the site.
- Owner: repository maintainers.
