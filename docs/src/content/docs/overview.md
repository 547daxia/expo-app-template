---
title: Overview
description: The current scope and design of Expo App Template.
---

Expo App Template is an independently maintained foundation for Expo
applications. It provides typed configuration, feature boundaries, quality
checks, and release tooling while leaving product and backend choices to the
adopting project.

The app includes onboarding, guarded authentication, Feed list/detail/create
flows, persisted light/dark/system themes, Settings, and an interactive Style
Demo. Production configuration rejects the template name, placeholder
iOS/Android identifiers, non-HTTPS API URLs, and known demo hosts. Authentication
demo sign-in is disabled in production.

For implementation details, use the canonical documentation:

- [Architecture](/core/architecture/)
- [Configuration and Environments](/getting-started/configuration/)
- [UI and Theming](/ui/)
- [Testing](/quality/testing/)
- [Production Readiness](/operations/production-readiness/)

The project follows Expo's [Continuous Native Generation workflow](https://docs.expo.dev/workflow/continuous-native-generation/):
native projects are generated when needed, while durable configuration stays in
app config or plugins.
