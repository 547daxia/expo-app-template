# Gluestack UI migration

- Decision: `src/components/ui/` is the only shared UI layer. All installed
  component groups are maintained; `src/components/legacy-ui/` is removed and
  must not return.
- Catalog: the Style tab renders interactive examples for every top-level UI
  directory. `component-groups.test.ts` prevents the inventory from drifting.
- Generated code: Gluestack CLI-generated primitives remain locally owned but
  are excluded from Jest coverage. Custom behavior layered around them must be
  covered by focused tests without lowering the global thresholds.
- Custom components: the maintained custom layer currently includes Chat AI,
  DatePicker, DateTimePicker, ImageViewer, and Tabs.
- Date and time behavior: native and web pickers use a draft value. Confirm or
  Done commits it; Cancel discards it.
- Chat behavior: keep the compound `Conversation`, `Message`, and `PromptInput`
  API. The unfinished `Chat`, `ChatMessages`, and `useChat` API is retired.
- Compatibility: feature screens use the Gluestack components directly. Do not
  add a barrel or legacy adapter to emulate the removed template UI API.
- Owner: repository maintainers.
