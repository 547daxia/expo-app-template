# Forms

Forms use TanStack Form and Zod. Define schemas outside the component, validate
on change, and compose controls from the Gluestack components in
`src/components/ui`.

## Basic pattern

```tsx
import { useForm } from '@tanstack/react-form';
import * as z from 'zod';

import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from '@/components/ui/form-control';
import { Input, InputField } from '@/components/ui/input';
import { VStack } from '@/components/ui/vstack';
import { getFieldError } from '@/lib/form-utils';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
});

export function EmailForm() {
  const form = useForm({
    defaultValues: { email: '' },
    validators: { onChange: schema },
    onSubmit: () => {
      // Send validated values to the feature API adapter.
    },
  });

  return (
    <VStack className="gap-4">
      <form.Field name="email">
        {(field) => {
          const error = getFieldError(field);

          return (
            <FormControl isInvalid={Boolean(error)}>
              <FormControlLabel>
                <FormControlLabelText>Email</FormControlLabelText>
              </FormControlLabel>
              <Input>
                <InputField
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChangeText={field.handleChange}
                />
              </Input>
              {error && (
                <FormControlError>
                  <FormControlErrorText>{error}</FormControlErrorText>
                </FormControlError>
              )}
            </FormControl>
          );
        }}
      </form.Field>

      <form.Subscribe selector={state => state.isSubmitting}>
        {isSubmitting => (
          <Button
            isDisabled={isSubmitting}
            onPress={() => void form.handleSubmit()}
          >
            {isSubmitting && <ButtonSpinner />}
            <ButtonText>Submit</ButtonText>
          </Button>
        )}
      </form.Subscribe>
    </VStack>
  );
}
```

`getFieldError` lives in [`src/lib/form-utils.ts`](../src/lib/form-utils.ts). It
only returns an error after a field is touched and supports both string and
object-shaped validation errors.

Use the shared `KeyboardAvoidingView` or an inset-adjusting `ScrollView` when a
form can be covered by the keyboard. Keep feature forms and their tests within
the owning feature; the login and add-post screens are the current reference
implementations.
