# Production Readiness

**Applies to:** the adopting project's first store release. Passing template
checks does not validate an external backend, signing account, legal policy, or
store-console setup.

## Enforced safeguards

- Native credentials use Expo SecureStore; MMKV is limited to non-sensitive
  preferences and Web does not persist bearer tokens in browser storage.
- Authentication hydration blocks the route tree and fails closed to signed-out
  state.
- Production environment validation rejects the template app name,
  `com.example.*` iOS/Android identifiers, non-HTTPS API URLs, and demo hosts.
  Expo ownership values remain a procedural prerequisite; see
  [Configuration](../getting-started/configuration.md).
- Generated native projects, local environment files, credentials, and another
  application's EAS identifiers are not committed.
- Dependabot checks application, documentation, and GitHub Actions dependencies
  weekly.

## Project-owned release checklist

1. Replace app name, schemes, bundle IDs, Android package, assets, description,
   and optional public app URL.
2. Configure an owned HTTPS API and real authentication backend, including
   refresh, expiry, revocation, and logout behavior.
3. For Web, use server-managed Secure and HttpOnly cookies rather than
   JavaScript-readable bearer-token storage.
4. Configure Expo owner, slug, EAS project ID, build environments, credentials,
   repository secrets, privacy disclosures, permissions, consent, legal
   documents, and store metadata.
5. Run `pnpm check-all`, a strict production prebuild, and
   `pnpm export:production`. Run the Android Maestro flow and project-owned
   iOS/Web release checks.
6. Verify the Style Demo in production; it is an intentional shipped surface.
7. Review [`src/app/+html.tsx`](../../src/app/+html.tsx): its current viewport
   policy limits browser zoom, which may not meet a product's accessibility
   requirements.

See [Release and CI/CD](./release.md) for workflow behavior and build commands.
