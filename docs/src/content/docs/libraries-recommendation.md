---
title: Optional Libraries
description: Optional integrations to evaluate for common Expo application needs.
head:
  - tag: title
    content: Optional Libraries | Expo App Template
---

The template already includes the libraries listed in `package.json`. Add an
optional integration only when the product has a concrete requirement, and
evaluate Expo compatibility, native configuration, privacy, bundle impact, and
ongoing ownership first.

## Complex workflows

[XState](https://stately.ai/docs) is an option when application behavior is best
modeled as explicit state machines or actors. Continue using Zustand for small,
straightforward client state.

## Error reporting

[Sentry](https://docs.expo.dev/guides/using-sentry/) supports Expo and EAS. It is
not installed by this template; follow the [Sentry setup recipe](/recipes/sentry-setup/)
and keep authentication tokens outside `EXPO_PUBLIC_*` variables.

## Notifications

- [Expo Push Notifications](https://docs.expo.dev/push-notifications/overview/)
- [OneSignal](https://onesignal.com/)

Push notifications require native credentials and a development build. Decide
who owns delivery, user consent, token lifecycle, and backend integration before
choosing a provider.

## Analytics

- [PostHog for React Native](https://posthog.com/docs/libraries/react-native)
- [React Native Firebase Analytics](https://rnfirebase.io/analytics/usage)

Document the event contract and implement consent, data minimization, and
environment separation before enabling analytics.

## Charts

[Victory Native](https://github.com/FormidableLabs/victory-native-xl) is one
option for native charts. Validate its current Expo SDK and rendering-engine
requirements against the project before installation.

This list is intentionally selective and is not an endorsement for every app.
