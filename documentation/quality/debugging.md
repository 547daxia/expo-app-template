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

JavaScript and TypeScript edits normally use Fast Refresh. Rebuild after native
dependency, Kotlin, Swift, or native configuration changes; follow
[Local Native Modules](../platform/native-modules.md). A bundler reload cannot
update the installed native binary.

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
