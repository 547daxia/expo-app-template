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
- **Project components:** BottomSheet, DatePicker, DateTimePicker, ImageViewer,
  and Tabs live in `src/components/`, with tests alongside their implementation.
  Their former generated-directory paths are removed.
- **Behavior to preserve:** date/time picker changes are drafts until
  Confirm/Done; Cancel discards them.
- **Imports:** use the current explicit component paths without compatibility
  barrels or re-exports.
- **Procedure:** follow
  [Gluestack UI Maintenance](../ui/gluestack-ui-maintenance.md).
- **Owner:** repository maintainers.
