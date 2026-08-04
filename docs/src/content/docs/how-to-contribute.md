---
title: How to Contribute
description: How to contribute to Expo App Template, report bugs, and share improvements.
head:
  - tag: title
    content: How to Contribute | Expo App Template
---

Contributions to code, tests, documentation, and project tooling are welcome.

1. Use [issues](https://github.com/547daxia/expo-app-template/issues) for reproducible bugs or scoped enhancements.
2. Use [discussions](https://github.com/547daxia/expo-app-template/discussions) for questions and broader proposals.
3. Keep feature code inside its owning `src/features/` directory, reusable project UI under `src/components/`, and Gluestack-generated primitives under `src/components/ui/`.
4. Update canonical files under `documentation/` whenever behavior, configuration, testing, or release requirements change.
5. Run `pnpm check-all` before opening a pull request. Verify affected native/Web platforms and update the Style Demo inventory when shared UI changes.

Pull requests should explain the motivation, affected surfaces, and verification performed. Never include `.env` files, credentials, generated native projects, or another project's EAS identifiers.

Do not manually edit Gluestack-generated files. Use a pinned CLI version for
generation, and place reusable customization in the project-owned component
layer. Follow the canonical Gluestack UI maintenance guide before refreshing or
upgrading components.
