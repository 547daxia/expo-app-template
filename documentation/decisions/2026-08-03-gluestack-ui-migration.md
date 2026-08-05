# Gluestack UI migration

- **Status:** accepted
- **Decision:** `src/components/ui/` is the replaceable Gluestack-generated
  layer. Reusable project wrappers and compounds belong in `src/components/`;
  feature-only components belong to their feature.
- **Boundary:** generated source must not import project code and must not gain
  project helpers or tests. Features may directly import an unmodified
  primitive.
- **Catalog:** the Style tab and `component-groups.test.ts` track every
  top-level generated directory.
- **Transition:** BottomSheet, DatePicker, DateTimePicker, ImageViewer, Tabs,
  and compatibility files remain historical exceptions. Extract their
  project-owned behavior before refreshing an affected group.
- **Behavior to preserve:** date/time picker changes are drafts until
  Confirm/Done; Cancel discards them.
- **Compatibility:** do not recreate `legacy-ui`, a UI barrel, or retired
  `Chat`, `ChatMessages`, and `useChat` APIs.
- **Procedure:** follow
  [Gluestack UI Maintenance](../ui/gluestack-ui-maintenance.md).
- **Owner:** repository maintainers.
