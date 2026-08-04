# Production Readiness

This repository is maintained as a production-ready application foundation.
Its architecture, credential boundary, environment validation, quality gates,
native generation, and release automation are safe defaults. Project-specific
backend behavior, ownership, legal disclosures, and store delivery still belong
to the adopting application.

## Enforced safeguards

- Native credentials use Expo SecureStore; MMKV is limited to non-sensitive
  preferences and Web does not persist bearer tokens in browser storage.
- Authentication hydration blocks the route tree and fails closed to signed-out
  state.
- Every production configuration path rejects the template app name,
  `com.example.*` identifiers, non-HTTPS API URLs, and demo endpoints.
- The manual production EAS workflow triggers both Android and iOS builds.
- Ordinary pull-request checks run lint, TypeScript, Jest coverage, and
  dependency auditing. Dependency-manifest pull requests additionally run
  Expo configuration and Doctor checks; the GitHub Release gate adds Expo
  dependency alignment, native configuration validation, Doctor, and the
  documentation build.
- Generated native projects, local environment files, credentials, and another
  application's EAS identifiers are not committed.
- Dependabot checks application, documentation, and GitHub Actions dependencies
  weekly.

## Project-owned release checklist

Before the first store build:

1. Verify or replace the app name, schemes, bundle IDs, Android packages,
   icons, splash assets, description, and optional public app URL. CLI-created
   projects receive derived identity values; other creation paths retain the
   template placeholders.
2. Set a project-owned HTTPS API URL and connect the login form to the real
   authentication backend. Implement refresh, expiry, revocation, and logout
   behavior for that backend.
3. For Web sessions, prefer server-managed Secure and HttpOnly cookies rather
   than adding bearer tokens to localStorage or IndexedDB.
4. Configure Expo owner, slug, EAS project ID, build environments, credentials,
   and repository secrets.
5. Add project-specific privacy disclosures, permissions copy, analytics and
   crash-reporting consent, legal documents, and store metadata.
6. Run `pnpm check-all`, strict production prebuild, and
   `pnpm export:production`. Run the included Maestro flow for Android and the
   project's own release checks for iOS and Web; this repository does not
   provide iOS or Web Maestro workflows.
7. Verify the Style Demo in production; it is an intentional shipped surface
   and must remain synchronized with the installed shared UI inventory.
8. Review the Web document policy in `src/app/+html.tsx`. The current app-like
   viewport limits browser zoom; enable a scalable viewport when the product's
   accessibility requirements include browser zoom.

Passing repository checks means the template infrastructure is internally
consistent. It does not validate an external backend, signing account, privacy
policy, or store-console configuration that is not present in the repository.
