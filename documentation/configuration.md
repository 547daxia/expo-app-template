# Configuration and Environments

## Environment contract

[`env.ts`](../env.ts) is the single typed configuration entry point. Values are validated with Zod and support three app environments:

| Environment | Purpose | Default identifier |
| --- | --- | --- |
| `development` | Local development builds | `com.example.mobileapp.development` |
| `preview` | Internal/staging builds | `com.example.mobileapp.preview` |
| `production` | Store builds | `com.example.mobileapp` |

The identifiers above are safe placeholders and must be replaced before publishing.

## Local configuration

```bash
cp .env.example .env
```

The example file sets `EXPO_PUBLIC_APP_ENV`, `EXPO_SLUG`,
`EXPO_PUBLIC_API_URL`, `EXPO_PUBLIC_VAR_NUMBER`, and `EXPO_PUBLIC_VAR_BOOL`
explicitly. Expo account ownership and project ID are intentionally commented
until the repository is linked to its own EAS project. The optional
`EXPO_PUBLIC_ASSOCIATED_DOMAIN` value is validated but is not consumed by
`app.config.ts` until a project adds associated-domain handling.

If omitted, `env.ts` defaults the environment to `development`, the number to
`0`, and the boolean to `false`. A strict prebuild still requires an explicit,
valid `EXPO_PUBLIC_API_URL`; the development server uses a harmless placeholder
while `.env` is absent. The repository currently has no committed `.env` file.

`EXPO_PUBLIC_*` values are bundled into the client and must not contain secrets. Non-prefixed values such as `APP_BUILD_ONLY_VAR` are available only while evaluating `app.config.ts`.

Development commands warn when validation fails. Prebuild commands set `STRICT_ENV_VALIDATION=1` and fail instead:

```bash
pnpm prebuild:development
pnpm prebuild:preview
pnpm prebuild:production
```

## Taking ownership

Before EAS Build or EAS Update:

1. Replace `NAME`, `BUNDLE_IDS`, `PACKAGES`, and `SCHEMES` in `env.ts`.
2. Update icons, splash assets, description, and other app metadata in `app.config.ts`.
3. Set `EXPO_ACCOUNT_OWNER`, `EXPO_SLUG`, and `EAS_PROJECT_ID` in local/EAS environment configuration.
4. Run `pnpm exec expo config --type public` and verify owner, slug, scheme, iOS bundle ID, Android package, and `extra.eas.projectId`.
5. Create/link the EAS project with `pnpm dlx eas-cli@latest init --force`.

This document is the full ownership and environment handoff checklist. Keep the resolved configuration output from `pnpm exec expo config --type public` with the project setup record.
