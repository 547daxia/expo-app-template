# Gluestack UI Maintenance

## Goal

Treat [`src/components/ui/`](../src/components/ui/) as a replaceable Gluestack
generated layer. New project behavior, branding, and product-specific defaults
must live outside that directory so a future Gluestack release can overwrite the
generated files without requiring project customizations to be reconstructed.

Gluestack uses a copy-paste distribution model, so generated files are committed
to this repository. For this project, committed does not mean freely editable:
the generated directory is maintained as an upstream boundary.

## Ownership boundaries

| Path | Ownership | Rules |
| --- | --- | --- |
| `src/components/ui/` | Gluestack generated source | Do not manually edit, add project helpers, or place project tests here. It may be overwritten by the CLI. |
| `src/components/` | Shared project UI | Wrap or compose Gluestack primitives here for reusable styling and behavior. |
| `src/features/<feature>/components/` | Feature-owned UI | Keep components here when they are meaningful to only one feature. |

Imports flow toward the generated layer:

```text
features and routes -> shared project components -> Gluestack generated UI
features and routes ------------------------------> Gluestack generated UI
```

A feature may import an unmodified primitive directly from `@/components/ui`.
Once the project needs reusable defaults or changed behavior, introduce a
named project component under `src/components/` instead of editing the primitive.
Generated UI must never import from either project-owned layer.

There is no shared barrel file. Import generated primitives and project
components from their explicit directories.

## Customization choices

Choose the smallest project-owned layer that satisfies the requirement:

1. Prefer theme tokens in `src/global.css` for application-wide color,
   typography, radius, and spacing decisions.
2. Pass supported props and `className` when a customization is local to one
   call site.
3. Create a wrapper or compound component in `src/components/<name>/` for
   reusable styling, defaults, accessibility behavior, or composition.
4. Keep feature-only behavior in `src/features/<feature>/components/`.
5. Fork source into `src/components/<name>/` only when the official component
   cannot be extended through composition. A fork is project-owned code, must
   use a project-specific name, and must record its upstream component, version,
   reason, and material differences.

Do not copy an official file merely to change a class name. Do not create a
wrapper that only re-exports the same API without adding a project contract.

Example wrapper:

```tsx
import type { ComponentProps } from 'react';

import { Button, ButtonText } from '@/components/ui/button';

type PrimaryButtonProps = ComponentProps<typeof Button> & {
  label: string;
};

export function PrimaryButton({ label, ...props }: PrimaryButtonProps) {
  return (
    <Button className="rounded-xl" action="primary" {...props}>
      <ButtonText>{label}</ButtonText>
    </Button>
  );
}
```

## Adding an upstream component

Use an explicit CLI version so another developer or CI run receives the same
source. Replace the placeholders with versions reviewed for this repository:

```bash
pnpm dlx gluestack-ui@<cli-version> add <component> \
  --path src/components/ui \
  --use-pnpm \
  -y
```

Review all generated changes, including `package.json`, `pnpm-lock.yaml`, theme
files, and build configuration. Do not use `@latest` in a committed script or
documented reproducible workflow.

After generation, add the installed top-level group to the Style Demo inventory
and verify it interactively. Project wrappers may also be demonstrated in the
Style Demo, but they do not become part of the generated layer.

## Upgrading Gluestack

Gluestack upgrades affect both installed packages and copied component source.
The CLI `upgrade` command may target styling-engine migrations rather than a
general library major-version upgrade. Always follow the migration guide for
the target release and then regenerate the component source it requires.

Use this workflow:

1. Read the target release notes, migration guide, supported Expo/React Native
   versions, and styling-engine requirements.
2. Start from a clean worktree and create a dedicated upgrade branch.

   ```bash
   git status --short
   git switch -c chore/upgrade-gluestack-<version>
   ```

3. Upgrade `@gluestack-ui/core`, `@gluestack-ui/utils`, and any generated
   component dependencies to the exact compatible versions specified by the
   release. Use `pnpm exec expo install` for Expo-managed or native runtime
   packages.
4. Run the target CLI with an exact version and regenerate all installed
   components. Re-adding components overwrites their source, which is expected
   for this directory.

   ```bash
   pnpm dlx gluestack-ui@<target-cli-version> add --all \
     --path src/components/ui \
     --use-pnpm \
     -y
   ```

5. Review the generated diff before adapting project code.

   ```bash
   git diff -- src/components/ui package.json pnpm-lock.yaml
   ```

6. Update imports or props in `src/components/` and feature code. Do not repair
   upgrade breakage by putting project behavior back into generated files.
7. Run the repository checks and verify the Style Demo on every affected
   platform.

   ```bash
   pnpm lint
   pnpm type-check
   pnpm test
   pnpm exec expo install --check
   pnpm doctor
   pnpm docs:build
   ```

8. Commit the dependency/generated-source upgrade separately from application
   compatibility changes when practical. This keeps review and rollback clear.

If newly generated source conflicts with repository linting, formatting, or
type rules, do not silently edit it. Prefer, in order: a fixed upstream release,
pinning the previous version, a narrowly documented tooling exception for the
generated directory, or a project-owned wrapper/fork. Report upstream defects
when possible.

## Version record

For each upgrade, record the following in the upgrade pull request or commit:

- Gluestack CLI version and exact generation command
- `@gluestack-ui/core` and `@gluestack-ui/utils` versions
- styling engine and version
- upstream migration guide used
- overwritten component groups
- project wrappers or forks that required adaptation
- platforms and commands used for verification

The lockfile records package versions, but it does not identify which CLI
template produced copied source. The explicit CLI record closes that gap.

## Current transition status

This boundary is the policy for all new work, but the current directory is not
yet a clean generated baseline. At the time this policy was adopted, existing
project changes remained in generated component groups including BottomSheet,
Chat AI, DateTimePicker, ImageViewer, and Tabs. DatePicker, tests, helpers, Web
compatibility files, file-name corrections, and several generated-source
compatibility fixes also remain under `src/components/ui/`.

Do not extend those exceptions. Move reusable behavior and its tests to
`src/components/`, or to the owning feature, before replacing the affected
generated group. Once the migration is complete, regenerate the whole directory
with a pinned CLI version and record that version as the clean baseline.

Until then, never run `add --all` directly on the main branch: it will overwrite
the documented transitional changes. Use an isolated branch or worktree and
review the diff first.

The 2026-08-03 audit used Gluestack CLI `5.0.3`; the project declared
`@gluestack-ui/core` `5.0.15`, `@gluestack-ui/utils` `5.0.6`, and Uniwind
`^1.2.4`. These values identify the audit point, not a clean generated-source
baseline. Replace this note with the recorded baseline after the transition is
complete.

## Review checklist

- `src/components/ui/` contains only files produced by the selected Gluestack
  initialization and component-generation workflow.
- New project wrappers use project-specific names under `src/components/`.
- Feature-only components remain inside their feature.
- No project test, helper, or compatibility file was added to generated UI.
- The Style Demo inventory matches the installed generated groups.
- Accessibility labels, keyboard behavior, `testID` forwarding, theme modes,
  and native/Web behavior were verified where applicable.
- Documentation and the recorded generation version were updated.

## Upstream references

- [Gluestack CLI](https://gluestack.io/ui/docs/home/getting-started/cli)
- [Gluestack installation](https://gluestack.io/ui/docs/home/getting-started/installation)
- [Gluestack copy-paste architecture](https://gluestack.io/ui/docs/home/overview/introduction)
