# Forms

**Applies to:** feature forms. Use TanStack Form and Zod; do not introduce a
second form library.

Define schemas outside the component, validate on change, and compose controls
from Gluestack primitives. Reusable form behavior belongs in `src/components/`,
not generated UI.

```tsx
export function EmailForm() {
  const form = useForm({
    defaultValues: { email: '' },
    validators: { onChange: z.object({ email: z.string().email() }) },
    onSubmit: ({ value }) => submit(value),
  });

  // Bind form fields and render the form here.
  return null;
}
```

Bind `InputField` values to the field, call `handleBlur` and `handleChange`, and
obtain touched-only validation feedback from
[`getFieldError`](../../src/lib/form-utils.ts). Subscribe only to the form state
needed by an individual control.

Login and Add Post are the reference implementations for validation,
submission, and error presentation. The Style Demo's
[`FormsDemo`](../../src/features/style-demo/components/forms-demo.tsx) is the
current reference for `KeyboardAvoidingView`; use it, or a correctly configured
keyboard-aware scroll container, when an input can be obscured by the keyboard.

Keep forms and their tests in the owning feature. See [UI Components](./components.md)
for the generated-source boundary.
