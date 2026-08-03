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
- Gluestack UI, Uniwind, Tailwind CSS v4, and 60 maintained component groups
- TanStack Query, Axios, and React Query Kit for server state
- TanStack Form and Zod for validated forms
- Zustand and MMKV for non-sensitive local state
- Jest, React Native Testing Library, coverage thresholds, and Maestro
- Development, preview, and production environment profiles

## Included examples

The app includes onboarding, guarded authentication, feed list/detail/create
flows, persisted light/dark/system themes, settings, and an interactive Style
Demo. These are working reference implementations, not finished product
features. Demo authentication and the feed API must be replaced before release;
demo sign-in is deliberately disabled in production.

## UI ownership

`src/components/ui/` is the only shared UI layer. Every installed component
group is maintained and represented in the Style Demo. Gluestack CLI-generated
primitives are excluded from Jest coverage, while custom behavior such as Chat
AI, date/time pickers, ImageViewer, and Tabs remains covered by focused tests.

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

## Contributing

Issues and pull requests are welcome. Run `pnpm check-all`, update canonical
documentation when behavior changes, and verify affected platforms before
submitting a change.
