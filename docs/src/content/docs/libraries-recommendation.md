---
title: Optional Libraries
description: Optional integrations to evaluate for common Expo application needs.
---

The template already includes the libraries in `package.json`. Add another
integration only for a concrete product requirement, after evaluating Expo
compatibility, native configuration, privacy, bundle impact, and ongoing
ownership.

- [XState](https://stately.ai/docs) can help with explicitly modeled complex
  workflows; keep Zustand for small client state.
- [Expo Push Notifications](https://docs.expo.dev/push-notifications/overview/)
  and [OneSignal](https://onesignal.com/) are options for notifications.
- [PostHog](https://posthog.com/docs/libraries/react-native) and
  [React Native Firebase Analytics](https://rnfirebase.io/analytics/usage) are
  analytics options.
- [Victory Native](https://github.com/FormidableLabs/victory-native-xl) is one
  charting option.

Document consent, data minimization, event contracts, and environment separation
before enabling analytics or notifications. For crash reporting, use the
canonical [Sentry Setup](/recipes/sentry/) guide.
