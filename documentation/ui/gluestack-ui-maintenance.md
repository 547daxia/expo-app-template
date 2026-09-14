# Gluestack UI Maintenance

**Applies to:** adding, regenerating, or upgrading the replaceable Gluestack
layer. Read this before changing `src/components/ui/`.

## Boundary

`src/components/ui/` is committed copied source, but it is an upstream boundary
rather than project-owned code. Do not manually edit it or add project helpers
or tests there. Put reusable behavior in `src/components/` and feature-only
behavior in the owning feature. The component-selection contract and catalog
live in [UI Components](./components.md).

Imports flow toward generated source:

```text
features and routes -> shared project components -> Gluestack generated UI
features and routes ------------------------------> Gluestack generated UI
```

Generated Web text primitives render DOM elements directly. Project-owned code
must use [`src/components/platform-props.ts`](../../src/components/platform-props.ts)
for selectable text, text test IDs, and line limits so native behavior is kept
without leaking React Native-only props into the DOM. Other reusable platform
adaptations, such as loading indicators, also belong in `src/components/`.

## Adding a primitive

Use a reviewed, explicit CLI version:

```bash
pnpm dlx gluestack-ui@<cli-version> add <component> \
  --path src/components/ui \
  --use-pnpm \
  -y
```

Review generated source, dependencies, lockfile, theme files, and build
configuration. Then update the Style Demo inventory and verify the affected
platforms. Do not document `@latest` as a reproducible workflow.

## Upgrading

1. Read target release notes, migration guidance, Expo/React Native support,
   and styling-engine requirements.
2. Start from a clean worktree and dedicated upgrade branch.
3. Upgrade the exact compatible package versions. Use `expo install` for
   Expo-managed or native runtime packages.
4. Regenerate every installed group with the exact target CLI version in an
   isolated branch or worktree.
5. Review the generated diff before adapting project code outside the generated
   directory.
6. Run lint, type checks, tests, Expo alignment, Doctor, the documentation
   build, and affected-platform Style Demo checks. Run `pnpm --dir docs install`
   once before the first documentation build in a checkout.

Do not repair upstream-generation failures by modifying generated source.
Prefer a fixed upstream release, a pin, a narrow documented tooling exception,
or a project-owned wrapper/fork.

## Project components and generated source

BottomSheet, DatePicker, DateTimePicker, ImageViewer, and Tabs are project-owned
components under `src/components/`, with their tests beside them. Import those
paths directly; their former `src/components/ui/` paths have been removed.
Their scrollable data uses FlashList. Generated primitives never import these
project components, and no compatibility re-exports are maintained.

The Style Demo tracks generated directories through `COMPONENT_GROUPS` and
these compound components through `PROJECT_COMPONENT_GROUPS`. Keep both sets
represented in the demo. Generated source has no project-owned tests.

This ownership separation does not certify the remaining copied source as a
fresh CLI output. Before a regeneration, record the exact CLI version,
generation command, package versions, overwritten groups, and platform checks.
The recorded generation audit used CLI `5.0.3`, core `5.0.15`, utils `5.0.6`,
and Uniwind `^1.2.4`; dependency upgrades require a separate reviewed generation.

## References

- [Gluestack CLI](https://gluestack.io/ui/docs/home/getting-started/cli)
- [Gluestack installation](https://gluestack.io/ui/docs/home/getting-started/installation)
- [Gluestack copy-paste architecture](https://gluestack.io/ui/docs/home/overview/introduction)
