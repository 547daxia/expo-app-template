# Sentry Setup

**Applies to:** projects that choose Sentry. It is not installed or configured
by the template.

Use the current [Expo Sentry guide](https://docs.expo.dev/guides/using-sentry/)
as the implementation source of truth. It recommends the Sentry wizard, which
installs the SDK and applies Metro and initialization changes appropriate to the
installed SDK version.

## Integration boundary

1. Create a Sentry React Native project and run the setup command recommended
   by the official guide.
2. Review the wizard's changes before committing them. Keep generated native
   projects out of version control; this template uses Continuous Native
   Generation.
3. Store `SENTRY_AUTH_TOKEN` only in EAS or CI secrets. Never put it, or any
   other secret, in `EXPO_PUBLIC_*` values.
4. If client-visible configuration such as a DSN is needed, use an
   `EXPO_PUBLIC_` name and add it to the typed schema in
   [`env.ts`](../../env.ts). A DSN is visible to the application; an
   authentication token is not.
5. Build a development or preview client and verify that a deliberately
   captured test error reaches the expected Sentry project. Remove test-only
   crash controls before release.

For EAS Build, make the authentication token available to the build environment
so source maps can be uploaded. For EAS Update, follow the official guide's
source-map upload step after publishing the update.

## References

- [Expo: Using Sentry](https://docs.expo.dev/guides/using-sentry/)
- [Expo: Environment variables in EAS](https://docs.expo.dev/eas/environment-variables/usage/)
