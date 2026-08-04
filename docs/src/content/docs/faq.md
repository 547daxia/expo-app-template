---
title: Frequently asked questions
description: Frequently asked questions about Expo App Template.
head:
  - tag: title
    content: FAQ | Expo App Template
---

### Is this a finished production app?

It is a production-ready application foundation, with working reference flows
and release safeguards. A project must still provide its own identity, artwork,
API, authentication backend, EAS ownership, credentials, privacy disclosures,
and store metadata. Production validation always fails closed and blocks the
template identity, non-HTTPS endpoints, and demo API. Demo sign-in is disabled
instead of silently shipping mock access.

### Why does the project use Expo?

Expo Router and Continuous Native Generation provide file-based navigation and
reproducible native projects without committing generated `ios/` and `android/`
directories. Native configuration belongs in `app.config.ts` or config plugins.
See Expo's [CNG documentation](https://docs.expo.dev/workflow/continuous-native-generation/).

### Where is the shared UI library?

`src/components/ui/` contains replaceable Gluestack-generated primitives.
Reusable project wrappers and compound components belong in `src/components/`,
while feature-only components remain in their feature. Installed generated
groups and important reusable components are demonstrated in the Style tab.
There is no shared barrel or `legacy-ui` compatibility layer.

### Can generated Gluestack components be edited?

No. The files are committed for reproducible builds, but this project treats
`src/components/ui/` as an upstream-generated boundary that may be overwritten.
Use props or theme tokens for local changes, wrap or compose primitives under
`src/components/` for reusable behavior, and keep feature-only UI in its
feature. Existing generated-file customizations are transitional exceptions and
must not be extended.

### Where are production tokens stored?

Native bearer tokens use Expo SecureStore and malformed values are removed.
MMKV remains limited to non-sensitive preferences. Web deliberately does not
persist bearer tokens in localStorage or IndexedDB; use server-managed Secure
and HttpOnly cookies for persistent browser sessions.

### Who maintains the template?

The project is based on
[obytes/react-native-template-obytes](https://github.com/obytes/react-native-template-obytes)
and is independently maintained by
[@547daxia](https://github.com/547daxia). It preserves the original MIT license
and copyright notice.

### Can another feature or library be included?

Add dependencies when a concrete project requirement justifies their runtime,
native-build, privacy, and maintenance costs. Template-wide additions should
solve a common need and include configuration, tests, and documentation.
