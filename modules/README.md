# Local Expo Modules

This directory contains project-local native modules discovered by Expo
autolinking. Modules belong here when application code needs a small native
capability that is not provided by an existing maintained Expo package.

`expo-template-native/` is an intentionally minimal example. It exposes one
synchronous `getNativeRuntimeInfo()` method, implements it in Kotlin and Swift,
and supplies a Web fallback. It does not request permissions, modify generated
native projects, or use a config plugin.

Application code imports the stable TypeScript facade:

```ts
import { getNativeRuntimeInfo } from 'modules/expo-template-native';

const runtime = getNativeRuntimeInfo();
```

See [`documentation/native-modules.md`](../documentation/native-modules.md) for
the module lifecycle, scaffolding command, native build requirements, testing,
and config-plugin boundary.
