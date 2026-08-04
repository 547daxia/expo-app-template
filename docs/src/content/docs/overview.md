---
title: Overview
description: The current scope and design of Expo App Template.
head:
  - tag: title
    content: Overview | Expo App Template
---

Expo App Template is an independently maintained foundation for Expo
applications. It provides typed configuration, feature boundaries, a maintained
UI library, automated quality checks, and release tooling while leaving product
and backend choices to the adopting project.

It originated from the Obytes React Native template and retains the original
MIT license and copyright notice. Current code, workflows, and documentation
are maintained in this repository.

## Current stack

- Expo SDK 56, React Native 0.85, React 19, TypeScript, and Expo Router
- Continuous Native Generation with a custom development client
- A project-local Expo Module example for Android and iOS, with a Web fallback
- Gluestack UI, Uniwind, Tailwind CSS v4, and a generated component catalog
- FlashList for project-owned scrollable data lists
- TanStack Query, Axios, and React Query Kit for server state
- TanStack Form and Zod for validated forms
- Zustand, Expo SecureStore for native credentials, and MMKV for non-sensitive local state
- Jest, React Native Testing Library, coverage thresholds, and Maestro
- Development, preview, and production environment profiles

## Included examples

The app includes onboarding, guarded authentication, feed list/detail/create
flows, persisted light/dark/system themes, settings, and an interactive Style
Demo that intentionally remains available in production. Reference product
content still needs project-specific branding, API, and authentication. Strict
production validation rejects the template identity, non-HTTPS endpoints, and
demo API, while demo sign-in is disabled instead of shipping mock access.
Settings also displays a small runtime value supplied by the included local
Expo Module so its native and Web integration remains exercised.

## UI ownership

`src/components/ui/` is the replaceable Gluestack-generated layer.
Project-owned wrappers and compound components live in `src/components/`, and
feature-only UI remains inside its feature. Installed generated groups and
important reusable components are represented in the Style Demo. Generated
primitives are excluded from Jest coverage. Historical hand-written groups and
tests still under the generated directory are documented transitional
exceptions; new project-owned behavior and tests belong outside that boundary.

## Documentation

The canonical operational documentation lives under `documentation/` and is
linked from the [Project Documentation](/project-documentation/) page. The
Starlight pages preserve browsable routes and project-level context without
duplicating those instructions.

## Why Expo

The project follows Expo's [Continuous Native Generation
workflow](https://docs.expo.dev/workflow/continuous-native-generation/): native
projects are generated when needed, and durable native configuration stays in
app config or config plugins.

The project-local module boundary, official scaffolding workflow, and native
verification expectations are documented in [Local Native Modules](/guides/native-modules/).

## Contributing

Issues and pull requests are welcome. Run `pnpm check-all`, update canonical
documentation when behavior changes, and verify affected platforms before
submitting a change.
