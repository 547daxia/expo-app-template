# AI-Assisted Development and Debugging

**Applies to:** handing work to a coding agent, reproducing application bugs,
and debugging Android development builds through ADB. Start with
[Development Workflow](../getting-started/development.md) and follow
[Repository Instructions](../../AGENTS.md).

## Existing capabilities and limits

| Area | Available in this template | Practical limit |
| --- | --- | --- |
| Agent guidance | `AGENTS.md`, a `CLAUDE.md` reference to it, and canonical Markdown documentation | Agents still need feature requirements and acceptance criteria |
| Implementation feedback | Strict TypeScript, ESLint architecture rules, Jest, and CI | Passing checks does not prove device behavior |
| UI references | Style Demo and existing login, Feed, and Settings features | Inspect changes on each affected platform |
| Runtime inspection | React Query devtools hook and a root error boundary that logs errors | No installed Sentry integration or unified structured request logging |
| Android interaction | Maestro flows and standard ADB commands | Requires local tools and a connected, authorized device or emulator |
| Other platforms | Web entrypoints and native iOS implementation | Hosted E2E flows currently cover Android only |

ADB is provided by the local Android SDK, not by an application dependency.
An agent with terminal access can invoke it when the device is accessible.
Check availability each session; an installed executable does not establish
that a device is connected. ADB captures Android runtime evidence; use the
development client's React Native DevTools for JavaScript breakpoints and
component inspection.

## Give an agent a reproducible task

Include the following in a development request or bug report:

```text
Goal / expected behavior:
Actual behavior and exact reproduction steps:
Platform, device model, OS version, and build environment:
Commit and relevant local changes:
Screen / route and starting state (onboarding, login, theme):
API environment and non-sensitive test data:
Error time, relevant logs, and screenshot or recording:
Acceptance criteria:
```

For a new feature, start from the closest existing feature and keep routes
thin. Read the relevant canonical topic before changing authentication,
generated UI, dependencies, or native configuration. For a bug, reproduce it,
identify the responsible layer, apply a focused fix, and repeat the same steps.
Add a regression test when it can capture the failure meaningfully. Report
which commands and platforms were actually verified and which remain untested.

Keep credentials and personal data out of logs and fixtures. Share the relevant
error and surrounding events rather than an unfiltered device log or `.env`.

## Connect an Android target

Install Android SDK Platform Tools and put its `platform-tools` directory on
the shell's `PATH` if `adb` is unavailable. Start an emulator through Android
Studio, or connect a phone with USB debugging enabled and accept the debugging
authorization on the unlocked phone. See the official
[ADB connection guide](https://developer.android.com/tools/adb).

```bash
adb version
adb devices -l
```

An empty list means there is no target. For `unauthorized`, accept the phone's
authorization prompt. For `offline`, check the device, cable, or emulator and
reconnect. Continue when the intended target is listed as `device` and Android
has finished booting.

In the following examples, replace `SERIAL_FROM_ADB_DEVICES` with that target's
serial. Set the package ID to the selected build's actual `android.package`
from `app.config.ts` and its environment configuration. The value below is the
unmodified template's development ID; adopting projects and preview builds
have different IDs.

```bash
DEBUG_DEVICE='SERIAL_FROM_ADB_DEVICES'
DEBUG_APP_ID='com.example.mobileapp.development'
adb -s "$DEBUG_DEVICE" shell pm path "$DEBUG_APP_ID"
```

Use `-s` on device commands to keep operations on the selected target. If the
package is absent, build and install it:

```bash
pnpm android --device
```

Select the same target in Expo's device picker. Expo's `--device <value>`
argument resolves a device name in this SDK; do not pass the ADB serial as
though it were the same identifier.

For an already-built APK, use
`adb -s "$DEBUG_DEVICE" install -r /absolute/path/to/app.apk`.
The installed binary must match the environment and native dependencies.
Expo Go cannot run the included local module.

### Recover after moving the checkout

If Gradle reports a missing project directory under the checkout's **old
absolute path**, generated autolinking or native build state may still refer
to that location. Check the path in the error before changing dependencies.
Restore dependencies from the lockfile, then regenerate only Android:

```bash
pnpm install --frozen-lockfile
pnpm exec expo prebuild --platform android --clean --no-install
pnpm android --device
```

`--clean` replaces the generated `android/` directory. Preserve any local
native experiments first; durable changes belong in modules or config plugins.
Do not commit the regenerated directory. If pnpm reports
`ERR_PNPM_ABORTED_REMOVE_MODULES_DIR_NO_TTY`, rerun the install in an interactive
terminal or use `CI=1 pnpm install --frozen-lockfile` for an intentional
non-interactive recreation of `node_modules`.

### Check device-side installation prompts

A build can finish successfully while installation waits on the phone. On the
tested vivo V2361A with Android 16, USB installation displayed an external-source
warning with an acknowledgement and a Continue Install button. Unlock the
phone, inspect the package being installed, and complete that installation
prompt. Confirm installation with `pm path` before investigating Metro.

Maestro also installs device-side helper packages, including
`dev.mobile.maestro` and `dev.mobile.maestro.test`; these can have separate
installation prompts. Treat build, installation, and application startup as
separate checkpoints.

## Connect Metro and reproduce

For an existing development build, start Metro in a separate terminal:

```bash
pnpm start
```

If the device cannot reach Metro over the network, reverse the port printed by
Metro. These examples assume port 8081:

```bash
adb -s "$DEBUG_DEVICE" reverse tcp:8081 tcp:8081
adb -s "$DEBUG_DEVICE" reverse --list
adb -s "$DEBUG_DEVICE" shell am start -a android.intent.action.MAIN -c android.intent.category.LAUNCHER -p "$DEBUG_APP_ID"
```

Open the matching Metro development server in the development client. Port
reversal forwards device localhost to the host; it does not select the server
inside the client or rewrite the app's API URL. A local backend needs its own
port mapping and a matching development API URL. Keep the production HTTPS
validation intact. Remove a temporary Metro mapping after debugging with
`adb -s "$DEBUG_DEVICE" reverse --remove tcp:8081`.

For a USB-only connection, start Metro with
`pnpm exec expo start --dev-client --localhost --port 8081`, then open its
development-client URL on the selected phone. This example uses the unchanged
template's generated development-client scheme; use the scheme printed by
Expo for an adopted project:

```bash
adb -s "$DEBUG_DEVICE" shell am start -a android.intent.action.VIEW \
  -d 'exp+mobile-app://expo-development-client/?url=http%3A%2F%2F127.0.0.1%3A8081' \
  -p "$DEBUG_APP_ID"
```

The port in the URL must match Metro and the ADB reverse mapping. Dismiss the
development client's first-run introduction to inspect the application itself.
Metro reporting a completed bundle or a connected debugger only proves that
part of the connection works; a native startup exception can still prevent
the first application screen from rendering.

When Metro is already running with `--localhost`, `pnpm android --device
--no-bundler` can still open a development-client URL containing the computer's
LAN address. If the client reports `ConnectException` or `ECONNREFUSED` for
that address, inspect the URL before changing dependencies. Confirm Metro is
running and the reverse mapping exists, then reopen the explicit `127.0.0.1`
URL above. Port reversal does not redirect a request addressed to a LAN IP.

JavaScript and TypeScript edits normally use Fast Refresh. Rebuild after native
dependency, Kotlin, Swift, or native configuration changes; follow
[Local Native Modules](../platform/native-modules.md). A bundler reload cannot
update the installed native binary.

### Resume debugging after dependency alignment

If Expo reports version mismatches, run `pnpm exec expo install --check` and
use Expo's installer to apply the recommended versions within the current SDK.
Follow [Dependency Upgrades](./dependency-upgrades.md) and preserve the reviewed
exclusions and patches. Review changes to `package.json`, `pnpm-lock.yaml`, and
`pnpm-workspace.yaml`; the installer can also update transitive Expo tooling.

Stop this project's running Metro process and start it again after installation
so the CLI and bundler use the updated packages. For changes involving native
packages, rebuild and reinstall the development client before testing. With
Metro running separately in USB-only mode, use:

```bash
pnpm android --device --no-bundler
adb -s "$DEBUG_DEVICE" reverse tcp:8081 tcp:8081
```

Open the localhost development-client URL above and repeat the cold-start
and interaction checks below. Finish with `pnpm check-all`; it includes Expo
dependency alignment and Expo Doctor. Run `pnpm run doctor` separately if an
earlier gate stops that command. Distinguish a successful iOS JavaScript export
from an iOS native build or device test when reporting validation.

## Collect evidence

Keep Metro output for bundling errors. For Android failures, capture a bounded
log snapshot immediately after reproducing the problem. The commands below use
a fresh temporary host directory so artifacts stay outside the repository:

```bash
DEBUG_ARTIFACTS=$(mktemp -d)
adb -s "$DEBUG_DEVICE" logcat -b main -b system -b crash -d -t 500 -v threadtime > "$DEBUG_ARTIFACTS/android.log"
adb -s "$DEBUG_DEVICE" exec-out screencap -p > "$DEBUG_ARTIFACTS/screen.png"
```

Record the directory path and reproduction time with the report. For a crash
that occurs during startup, begin streaming before launching the app:

```bash
adb -s "$DEBUG_DEVICE" logcat -b main -b system -b crash -v threadtime > "$DEBUG_ARTIFACTS/startup.log"
```

Reproduce in another terminal or on the device, then stop capture with Ctrl+C.
These logs include other processes; narrow the relevant excerpt by timestamp,
package, and crash stack before sharing. Process-only filtering can miss a
startup crash or events after the process restarts. Logcat also does not
guarantee that all JavaScript console output is available; retain Metro and
DevTools evidence. See the official
[Logcat guide](https://developer.android.com/tools/logcat) for filtering options.

For repeatable interactions, prefer the existing Maestro flows and stable
`testID` selectors. ADB shell input can help with a quick reproduction, but
coordinate-based taps depend on screen size and keyboard state.

If Maestro remains on `Launch app`, inspect the foreground activity and any
installation prompt before attributing the failure to application code:

```bash
adb -s "$DEBUG_DEVICE" shell dumpsys activity activities
adb -s "$DEBUG_DEVICE" shell pidof "$DEBUG_APP_ID"
```

Look for `topResumedActivity` or `mResumedActivity` in the activity output.
Capture the stalled state and stop that test run before manually reproducing
the flow. ADB interaction can validate a screen while Maestro is blocked, but
report it as a manual device check, not a passing automated E2E test. The cause
of the Maestro launch stall observed on the vivo device was not established.

For manual interaction, capture a current screenshot or UI hierarchy and use
its actual bounds with `adb -s "$DEBUG_DEVICE" shell input tap X Y`. Wait for
the resulting UI change before the next action. Keyboard transitions, developer menus, and
LogBox warnings can cover controls; inspect and dismiss the overlay rather
than repeatedly tapping a hidden tab. A screenshot resized for display has
different coordinates from the device's original image. UI hierarchies can
contain entered form values; apply the same redaction rules as for logs.

Include `DevLauncher` and `unknown:BridgelessReact` messages when investigating
a development-client startup failure. Filtering only `AndroidRuntime` or
`ReactNativeJS` can miss a native exception caught by the development client.
For `AppearanceModule.setColorScheme` reporting a null `style` argument, see
[Uniwind system appearance compatibility](./dependency-upgrades.md#uniwind-system-appearance-compatibility).
That issue can occur with the default system theme even after Metro connects.

## Control test state and verify the fix

Record whether the app starts signed in, whether onboarding has completed,
and whether the problem follows a fresh launch or a warm session. Use Settings
logout to exercise the normal session cleanup. This clears session caches and
demo posts, but does not reset onboarding or theme preferences. See
[Authentication](../core/authentication.md) and [Storage](../core/storage.md).

For an intentionally disposable development installation, Android's
`adb -s "$DEBUG_DEVICE" shell pm clear "$DEBUG_APP_ID"` resets application data,
including its local session and preferences. Use it only when that data loss
is intended, and capture the failing state first. Relaunch and establish the
same starting conditions before comparing behavior.

To test a cold process start while retaining persisted login and theme
preferences, use `adb -s "$DEBUG_DEVICE" shell am force-stop "$DEBUG_APP_ID"`
and reopen the development-client URL above. This still clears in-memory state;
it does not clear persisted application data like `pm clear` does.

The Feed demo still fetches remote sample data. Its locally created posts live
in memory for the session; it is not a fully offline fixture server. Use
`axios-mock-adapter` in focused API tests to reproduce timeouts, failed refresh,
and out-of-order responses deterministically. Do not describe those test mocks
as an available in-app debug mode.

Run the relevant focused test while iterating, for example:

```bash
pnpm exec jest src/lib/api/client.test.ts --runInBand
```

Before delivery, run `pnpm check-all` and repeat the original device flow.
For Android E2E with an explicit target and package, use Maestro's
[device selection](https://docs.maestro.dev/cli/start-device):

```bash
maestro --device "$DEBUG_DEVICE" test .maestro/ -e APP_ID="$DEBUG_APP_ID"
```

See [Testing](./testing.md) for setup and release checks. ADB success and Jest
success do not establish iOS or Web behavior; verify affected platforms too.

For an installation and startup smoke test, record these results separately:

| Checkpoint | Evidence required |
| --- | --- |
| Installed build | `pm path` resolves the intended package on the selected device |
| Application startup | An application screen renders after developer overlays are dismissed |
| Basic interaction | Onboarding/login works with demo credentials; Feed loads data; Style and Settings can be opened |
| Native module | Settings displays the expected Native Runtime platform and OS version |
| Theme regression | Light, dark, and system can be selected; returning from a fixed theme to system does not crash |
| Cold startup | Force-stop and reopen with system preference saved; inspect the resulting screen and fresh startup logs |
| Automated checks | Record actual test results, incomplete E2E runs, warnings, and failed quality gates |

Use fresh timestamps and process IDs after a restart so an older exception is
not mistaken for a new failure. Record nonfatal warnings too: for example, a
nested-list warning in Style Demo is distinct from an application crash.
If `check-all` stops at Expo dependency alignment, report that gate as failed
even when lint, type checking, and Jest passed. `pnpm run doctor` can be run
separately to inspect the checks skipped after that failure; follow
[Dependency Upgrades](./dependency-upgrades.md) for any version changes.

## Improvements for adopting projects

These are follow-up implementation tasks, not capabilities installed by this
guide:

1. Add deterministic development fixtures and selectable offline, timeout,
   empty-result, and expired-session scenarios, with a documented state reset.
2. Add structured, redacted request/error events with timestamps and request
   IDs, then connect error reporting and source maps using
   [Sentry Setup](../recipes/sentry.md) if Sentry is chosen.
3. Extend device regression coverage to the project's critical iOS and Web
   flows, recording build identity and useful failure artifacts.

Keep new debug controls development-only and document their actual commands
here when implemented.
