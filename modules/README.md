# Local Expo Modules

This directory contains project-local native modules discovered by Expo
autolinking. Use it only when application code needs a small native capability
that no maintained Expo package supplies.

`expo-template-native/` is an intentionally minimal example. It exposes
`getNativeRuntimeInfo()`, implements Kotlin, Swift, and Web behavior, and does
not request permissions, modify generated native projects, or use a config
plugin.

```ts
import { getNativeRuntimeInfo } from 'modules/expo-template-native';

const runtime = getNativeRuntimeInfo();
```

See [Local Native Modules](../documentation/platform/native-modules.md) for the
module lifecycle, official scaffold, rebuild requirements, config-plugin
boundary, and verification commands.
