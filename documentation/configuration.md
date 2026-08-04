# Configuration and Environments

## Environment contract

[`env.ts`](../env.ts) is the single typed configuration entry point. Values are validated with Zod and support three app environments:

| Environment | Purpose | Default identifier |
| --- | --- | --- |
| `development` | Local development builds | `com.example.mobileapp.development` |
| `preview` | Internal/staging builds | `com.example.mobileapp.preview` |
| `production` | Store builds | `com.example.mobileapp` |

The identifiers above are safe development placeholders. Strict production
validation rejects them before native configuration is generated.

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

Production configuration throws on any validation error regardless of how Expo
is invoked, including Web export and custom build commands. Development commands
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

This document is the full ownership and environment handoff checklist. Keep the resolved configuration output from `pnpm exec expo config --type public` with the project setup record.
