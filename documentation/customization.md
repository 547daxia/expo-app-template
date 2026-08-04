# Customization

## Application identity

Replace the template application name, bundle identifiers, Android package names, schemes, Expo owner, slug, and EAS project ID before publishing. The complete configuration contract is in [Configuration and Environments](./configuration.md).

## Visual assets

The app icon, Android adaptive icon, splash image, and web favicon live in [`assets/`](../assets/). Their paths and splash/adaptive-icon colors are configured in [`app.config.ts`](../app.config.ts).

After changing an asset or native configuration, create a development build to verify it on device. Use `pnpm prebuild:<environment>` only when you intentionally need to inspect generated native projects; do not commit `ios/` or `android/`.

## Template surfaces

Before release, configure the application identity and artwork, connect real
authentication, and replace the DummyJSON feed endpoint. Production validation
always fails closed and blocks the template name, identifiers, non-HTTPS
endpoints, and demo API. The Style Demo is an intentional production surface in
this template: keep it registered, update its examples with the shared UI
inventory, and include it in release verification.
