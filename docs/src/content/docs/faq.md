---
title: Frequently asked questions
description: Frequently asked questions about Expo App Template.
head:
  - tag: title
    content: FAQ | Expo App Template
---

### Is this a finished production app?

No. It is a production-oriented template with working reference flows. Replace
the demo authentication, feed API, template identity, repository links, and
artwork before release. Demo sign-in is disabled in the production environment.

### Why does the project use Expo?

Expo Router and Continuous Native Generation provide file-based navigation and
reproducible native projects without committing generated `ios/` and `android/`
directories. Native configuration belongs in `app.config.ts` or config plugins.
See Expo's [CNG documentation](https://docs.expo.dev/workflow/continuous-native-generation/).

### Where is the shared UI library?

All shared UI lives in `src/components/ui/`. The repository maintains every
installed Gluestack component group and demonstrates it in the Style tab. There
is no shared barrel or `legacy-ui` compatibility layer.

### Can generated Gluestack components be edited?

Yes. They are repository-owned source after generation. Keep upstream-style
primitives focused, put reusable custom behavior in the appropriate component
directory, update the Style Demo inventory, and test custom behavior.

### Is MMKV suitable for production tokens?

Not with the template's current setup. Its MMKV instance is not encrypted. Use
it only for non-sensitive preferences until an encrypted credential strategy is
implemented and reviewed.

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
