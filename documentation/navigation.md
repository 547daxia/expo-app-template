# Navigation

## Route tree

Expo Router maps files under [`src/app/`](../src/app/) to routes:

```text
src/app/
├── _layout.tsx              # root providers and stack
├── onboarding.tsx           # first-use flow
├── login.tsx                # authentication flow
├── (app)/_layout.tsx        # guarded tabs
├── (app)/index.tsx          # feed
├── (app)/style.tsx          # style demo
├── (app)/settings.tsx       # settings
├── feed/[id].tsx            # post detail
└── feed/add-post.tsx        # create post
```

Routes should re-export screens from `src/features/` so navigation configuration stays separate from feature logic.

## Navigation APIs

Use Expo Router `Link` for declarative navigation. For imperative navigation after actions, use [`src/lib/navigation.ts`](../src/lib/navigation.ts). Its `push` and `replace` methods apply a short lock to repeated calls targeting the same action and route; `forcePush` and `forceReplace` bypass an active lock for auth or deep-link flows.

```ts
import { navigate } from '@/lib/navigation';

navigate.replace('/');
```

The helper also exposes `back`, `canGoBack`, `canDismiss`, `dismiss`, `isLocked`, and `unlock`.
