# Forms

Forms use TanStack Form and Zod. Define schemas outside the component, validate on change, and render only the state each control needs.

## Basic pattern

```tsx
import { useForm } from '@tanstack/react-form';
import * as z from 'zod';

import { Button, Input, View } from '@/components/ui';
import { getFieldError } from '@/components/ui/form-utils';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
});

export function EmailForm() {
  const form = useForm({
    defaultValues: { email: '' },
    validators: { onChange: schema as any },
    onSubmit: () => {
      // Send validated values to your feature's API adapter.
    },
  });

  return (
    <View>
      <form.Field name="email">
        {field => (
          <Input
            label="Email"
            value={field.state.value}
            onBlur={field.handleBlur}
            onChangeText={field.handleChange}
            error={getFieldError(field)}
          />
        )}
      </form.Field>
      <form.Subscribe selector={state => [state.isSubmitting]}>
        {([isSubmitting]) => (
          <Button label="Submit" loading={isSubmitting} onPress={form.handleSubmit} />
        )}
      </form.Subscribe>
    </View>
  );
}
```

## Field errors and Select

`getFieldError(field)` only displays an error after the field is touched and supports both string and Zod error values. For a `Select`, update the field with its value:

```tsx
return (
  <form.Field name="category">
    {field => (
      <Select
        label="Category"
        value={field.state.value}
        options={categories}
        onSelect={field.handleChange}
        error={getFieldError(field)}
      />
    )}
  </form.Field>
);
```

Use `KeyboardAvoidingView` from `react-native-keyboard-controller` for forms that can be covered by the keyboard. The login and add-post screens are maintained end-to-end examples.
