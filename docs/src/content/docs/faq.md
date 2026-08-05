---
title: Frequently asked questions
description: Frequently asked questions about Expo App Template.
---

## Is this a finished production app?

It is a production-ready foundation, not a finished product. Your project still
owns identity, artwork, API, authentication backend, EAS ownership, credentials,
privacy disclosures, and store metadata. See
[Production Readiness](/operations/production-readiness/).

## Where are the core conventions?

Start with [Architecture](/core/architecture/) and
[Development Workflow](/getting-started/development/).

## Can generated Gluestack components be edited?

No. Use theme tokens, a project-owned wrapper, or feature-owned UI instead. See
[Gluestack UI Maintenance](/ui/gluestack-ui-maintenance/).

## Where are tokens stored?

Native bearer tokens use SecureStore; MMKV is for non-sensitive preferences; Web
does not persist bearer tokens in browser-readable storage. See
[Authentication](/core/authentication/) and [Storage](/core/storage/).

## How do I configure the project?

Follow [Configuration and Environments](/getting-started/configuration/).
