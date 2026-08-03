> This project was generated from the [Obytes React Native Template](https://github.com/obytes/react-native-template-obytes), a production-ready React Native starter with modern tooling and best practices.

## What: Technology Stack

- **Expo SDK 56** with React Native 0.85.3 and React 19.2 - Managed React Native development
- **TypeScript** - Strict type safety throughout
- **Expo Router 56** - File-based routing (like Next.js)
- **TailwindCSS** via Uniwind - Utility-first styling for React Native
- **Zustand** - Lightweight global state management
- **React Query** - Server state and data fetching
- **TanStack Form + Zod** - Type-safe form handling and validation
- **MMKV** - High-performance local key-value storage with optional encryption
- **Jest + React Testing Library** - Unit testing

## What: Project Structure

```
src/
├── app/              # Expo Router file-based routes (add new routes here)
├── features/         # Feature modules - auth, feed, settings are EXAMPLES
├── components/ui/    # Pre-built UI components (button, input, modal, etc.)
├── lib/              # Pre-configured utilities (api, auth, storage)
└── global.css        # TailwindCSS configuration

Root Files:
├── env.ts           # Environment config (CUSTOMIZE bundle IDs, API URLs)
├── app.config.ts    # Expo configuration
└── README.md        # Project-specific documentation
```

## How: Development Workflow

**Essential Commands:**
```bash
pnpm start              # Start dev server
pnpm ios/android        # Run on platform
pnpm lint               # ESLint check
pnpm type-check         # TypeScript validation
pnpm test               # Run Jest tests
pnpm check-all          # All quality checks
```

**Environment-Specific:**
```bash
pnpm start:preview              # Preview environment
pnpm ios:production             # Production iOS
pnpm build:production:ios       # EAS production build
```

**Expo dependency changes:**
```bash
pnpm exec expo install <package> # Install or align Expo-managed packages
pnpm exec expo install --check   # Verify Expo package compatibility
pnpm doctor                      # Run Expo diagnostics
```

Use `pnpm exec expo install` rather than `pnpm add` for Expo, React Native, and native runtime dependencies. After dependency changes, run `pnpm check-all`; also run the Expo checks above when an Expo-managed package changes.

## How: Key Patterns

- **Create features**: New folder in `src/features/[your-feature]/` with screens, components, API hooks
- **Add routes**: Create files in `src/app/` (file-based routing)
- **Forms**: Use TanStack Form + Zod (see `src/features/auth/components/login-form.tsx`)
- **Data fetching**: Use React Query (see `src/features/feed/api.ts`)
- **Global state**: Use Zustand (see `src/features/auth/use-auth-store.tsx`)
- **Styling**: Uniwind/Tailwind classes (see `src/components/ui/button.tsx`)
- **Storage**: Use MMKV via `src/lib/storage.tsx` for sensitive data
- **Imports**: Use `@/` for cross-feature or shared-module imports; relative imports are allowed within a feature or sibling component folder

## How: Ownership and Configuration

- Before the first EAS build, replace the template `EXPO_ACCOUNT_OWNER`, `slug`, `EAS_PROJECT_ID`, bundle identifiers, Android package names, schemes, and `package.json` repository URL.
- Start local configuration with `cp .env.example .env`. Never commit `.env`.
- `EXPO_PUBLIC_*` variables are bundled into the application. Never store credentials, tokens, or other secrets in them; use non-public build-time variables only from `app.config.ts`.
- Follow [First Project Setup](docs/src/content/docs/getting-started/first-project-setup.mdx) before publishing or enabling EAS services.

## How: Dependency and Runtime Safety

- Keep `react-native-worklets` installed with Reanimated on Expo SDK 56.
- Keep `@isaacs/brace-expansion` until Expo's Metro dependency tree no longer needs the explicit pnpm resolution.
- Do not remove `pnpm.overrides` without confirming the parent dependency has a safe patched release.
- Expo Router is the navigation integration. Prefer its APIs over direct `@react-navigation/*` imports unless a compatibility requirement is documented.

## How: Essential Rules

- ✅ **DO** use absolute imports: `@/components/ui/button`
- ✅ **DO** follow feature-based structure: `src/features/[name]/`
- ✅ **DO** use TanStack Form for forms (not react-hook-form)
- ✅ **DO** use MMKV storage for sensitive data (not AsyncStorage)
- ✅ **DO** use EAS Build for production: `pnpm build:production:ios`
- ✅ **DO** use the current environment profile (`development`, `preview`, or `production`) in scripts and EAS builds
- ✅ **DO** use `EXPO_PUBLIC_*` only for non-sensitive values required by app code
- ❌ **DO NOT** commit generated `android/` or `ios/` projects; this template uses CNG and config plugins
- ❌ **DO NOT** change the Expo account or EAS project identifiers without completing the ownership checklist
