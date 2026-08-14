# Navigation

**Applies to:** routes and imperative navigation. Route guards are defined by
the authentication and first-use state described in [Architecture](./architecture.md).

## Route tree

Expo Router maps files under [`src/app/`](../../src/app/) to routes:

```text
src/app/
├── _layout.tsx              # root providers and stack
├── +html.tsx                # Web document shell and viewport policy
├── +not-found.tsx           # unmatched-route fallback
├── onboarding.tsx           # first-use flow
├── login.tsx                # authentication flow
└── (app)/                   # guarded application group
    ├── _layout.tsx          # auth/first-use guard and Stack
    ├── (tabs)/_layout.tsx   # tab navigator
    ├── (tabs)/index.tsx     # feed
    ├── (tabs)/style.tsx     # style demo
    ├── (tabs)/settings.tsx  # settings
    ├── feed/[id].tsx        # guarded post detail
    └── feed/add-post.tsx    # guarded post creation
```

Routes should re-export screens from `src/features/` so navigation
configuration stays separate from feature logic.
Route groups do not affect public URLs, so Feed remains `/`, and detail/create
remain `/feed/[id]` and `/feed/add-post`.

## Navigation APIs

Use Expo Router `Link` for declarative navigation. For imperative navigation
after actions, use [`src/lib/navigation.ts`](../../src/lib/navigation.ts). Its
`push` and `replace` methods apply a short lock to repeated calls targeting the
same action and route; `forcePush` and `forceReplace` bypass an active lock for
auth or deep-link flows.

```ts
import { navigate } from '@/lib/navigation';

navigate.replace('/');
```

The helper also exposes `back`, `canGoBack`, `canDismiss`, `dismiss`,
`isLocked`, and `unlock`.
