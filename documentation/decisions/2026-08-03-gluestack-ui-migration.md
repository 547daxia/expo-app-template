# Gluestack UI migration

- Decision: `src/components/ui/` is the replaceable Gluestack-generated layer.
  Reusable project wrappers and compound components belong in
  `src/components/`; feature-only components belong to their feature.
- Generated boundary: do not manually edit generated files or add project
  helpers and tests to that directory. Use a pinned CLI version and record it
  whenever components are regenerated.
- Import direction: features and shared project components may import generated
  primitives; generated UI must not import project-owned code. Direct feature
  imports are allowed when a primitive is used without customization.
- Legacy removal: `src/components/legacy-ui/` is removed and must not return.
- Catalog: the Style tab renders interactive examples for every top-level UI
  directory and reusable project components as appropriate.
  `component-groups.test.ts` prevents the generated inventory from drifting.
- Coverage: generated primitives are excluded from Jest coverage. Project-owned
  behavior must be covered by focused tests without lowering global thresholds.
- Transition: existing customizations in BottomSheet, DatePicker,
  DateTimePicker, ImageViewer, Tabs, and compatibility files are historical
  exceptions. Do not extend them; extract them before refreshing the affected
  generated group.
- Date and time behavior: native and web pickers use a draft value. Confirm or
  Done commits it; Cancel discards it. Preserve this in a project-owned wrapper
  or compound component during extraction.
- Chat removal: the transitional Chat AI component group and its demo-only
  dependencies were removed. Do not reintroduce the retired `Chat`,
  `ChatMessages`, or `useChat` APIs; implement any future chat experience as a
  feature-owned component with explicit, product-specific dependencies.
- Compatibility: do not add a barrel or legacy adapter to emulate the removed
  template UI API.
- Procedure: follow
  [Gluestack UI Maintenance](../gluestack-ui-maintenance.md) for additions,
  upgrades, verification, and the current transition status.
- Owner: repository maintainers.
