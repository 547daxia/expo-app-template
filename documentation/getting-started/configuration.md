# Configuration and Environments

**Applies to:** every app created from this template. Complete the ownership
steps before EAS Build or EAS Update.

**Primary sources:** [`env.ts`](../../env.ts), [`app.config.ts`](../../app.config.ts),
[`.env.example`](../../.env.example), and [`eas.json`](../../eas.json).

## Environment contract

[`env.ts`](../../env.ts) is the single typed configuration entry point. Values are validated with Zod and support three app environments:

| Environment | Purpose | Default identifier |
| --- | --- | --- |
| `development` | Local development builds | `com.example.mobileapp.development` |
| `preview` | Internal/staging builds | `com.example.mobileapp.preview` |
| `production` | Store builds | `com.example.mobileapp` |

The identifiers above are safe development placeholders. Strict production
validation rejects them before native configuration is generated.

## Configuration ownership

Not every value beginning with `EXPO_PUBLIC_` comes from `.env`. The template
uses that prefix for values exposed to app code, including values intentionally
owned by source configuration.

| Value | Source of truth | How to change it | Client-visible |
| --- | --- | --- | --- |
| App name, scheme, iOS bundle ID, Android package | Constants in `env.ts` | Replace `NAME`, `SCHEMES`, `BUNDLE_IDS`, and `PACKAGES` | Yes |
| App version | `package.json` | Release through `pnpm app-release` or the version workflow | Yes |
| Expo slug | `.env` / EAS environment, read by `app.config.ts` | Set `EXPO_SLUG` | No |
| Expo owner and EAS project ID | `.env` / EAS environment, read by `app.config.ts` | Set `EXPO_ACCOUNT_OWNER` and `EAS_PROJECT_ID` | No |
| API URL, optional app URL | `.env` / EAS environment | Set the matching `EXPO_PUBLIC_*` value | Yes |

## Local configuration

```bash
cp .env.example .env
```

The example file sets `EXPO_PUBLIC_APP_ENV`, `EXPO_SLUG`,
`EXPO_PUBLIC_API_URL`, `EXPO_PUBLIC_VAR_NUMBER`, and `EXPO_PUBLIC_VAR_BOOL`
explicitly. Expo account ownership and project ID are intentionally commented
until the repository is linked to its own EAS project. `EXPO_PUBLIC_APP_URL`
optionally adds a Website and Share destination in Settings. The optional
`EXPO_PUBLIC_ASSOCIATED_DOMAIN` value is validated but is not consumed by
`app.config.ts` until a project adds associated-domain handling.

If omitted, `env.ts` defaults the environment to `development`, the number to
`0`, the boolean to `false`, and the feed endpoint to the public DummyJSON demo.
The repository currently has no committed `.env` file. Production validation
always fails closed and rejects non-HTTPS endpoints, DummyJSON,
`api.example.com`, the `MobileApp` name, and
`com.example.*` identifiers; a store build therefore cannot silently ship the
template identity or demo backend.

`EXPO_PUBLIC_*` values are bundled into the client and must not contain secrets. Non-prefixed values such as `APP_BUILD_ONLY_VAR` are available only while evaluating `app.config.ts`.

Production configuration throws on validation errors in the environment schema
regardless of how Expo is invoked, including Web export and custom build
commands. The code-enforced production checks are the app name, iOS/Android
identifiers, API URL format, HTTPS, and known demo hosts. Expo owner, slug, and
EAS project ID are required operational ownership prerequisites, but are not
currently validated by `env.ts` itself. Development commands
warn by default; prebuild commands opt into the same fail-closed behavior with
`STRICT_ENV_VALIDATION=1`:

```bash
pnpm prebuild:development
pnpm prebuild:preview
pnpm prebuild:production
```

## Taking ownership

Before EAS Build or EAS Update:

1. Verify or replace `NAME`, `BUNDLE_IDS`, `PACKAGES`, and `SCHEMES` in
   `env.ts`. The maintained CLI derives safe non-template values, while GitHub
   template and direct-clone workflows retain the source placeholders.
2. Update icons, splash assets, description, and other app metadata in `app.config.ts`.
3. Set `EXPO_ACCOUNT_OWNER`, `EXPO_SLUG`, and `EAS_PROJECT_ID` in local/EAS environment configuration.
4. Store client-visible EAS values such as `EXPO_PUBLIC_API_URL` with Plain text
   or Sensitive visibility so EAS CLI can read them while resolving dynamic app
   config; Secret visibility is unavailable during local config resolution.
5. Run `pnpm exec expo config --type public` and verify owner, slug, scheme, iOS bundle ID, Android package, and `extra.eas.projectId`.
6. Create/link the EAS project with `pnpm dlx eas-cli@21.4.0 init --force`.

## Assets and template surfaces

The app icon, Android adaptive icon, splash image, and Web favicon live in
[`assets/`](../../assets/). Their paths and colors are configured in
[`app.config.ts`](../../app.config.ts). After changing an asset or native
configuration, create a development build to verify it on device. Use
`pnpm prebuild:<environment>` only when you intentionally need generated native
projects; never commit `ios/` or `android/`.

Before release, replace the DummyJSON feed endpoint and demo authentication.
The Style Demo intentionally ships with this template: keep it registered,
synchronized with the shared UI inventory, and included in release verification.

This document is the full ownership and environment handoff checklist. Keep the resolved configuration output from `pnpm exec expo config --type public` with the project setup record.
