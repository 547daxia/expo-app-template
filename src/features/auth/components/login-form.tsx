import type { ComponentProps } from 'react';

import { useForm } from '@tanstack/react-form';
import React from 'react';
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
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { getFieldError } from '@/lib/form-utils';

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email format'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export type LoginFormProps = {
  onSubmit?: (data: LoginFormValues) => void | Promise<void>;
};

type FieldProps = {
  error?: string;
  label: string;
} & ComponentProps<typeof InputField>;

function LoginField({ error, label, ...props }: FieldProps) {
  return (
    <FormControl isInvalid={Boolean(error)}>
      <FormControlLabel>
        <FormControlLabelText>{label}</FormControlLabelText>
      </FormControlLabel>
      <Input>
        <InputField {...props} />
      </Input>
      {error && (
        <FormControlError>
          <FormControlErrorText selectable>{error}</FormControlErrorText>
        </FormControlError>
      )}
    </FormControl>
  );
}

export function LoginForm({ onSubmit }: LoginFormProps) {
  const form = useForm({
    defaultValues: { email: '', password: '' },
    validators: { onChange: loginSchema },
    onSubmit: async ({ value }) => onSubmit?.(value),
  });

  return (
    <VStack className="w-full gap-5">
      <VStack className="items-center gap-2 pb-2">
        <Text
          selectable
          testID="form-title"
          className="text-center text-4xl font-bold"
        >
          Sign In
        </Text>
        <Text selectable className="max-w-sm text-center text-muted-foreground">
          Sign in with any valid email and a password of at least six characters.
        </Text>
      </VStack>

      <form.Field name="email">
        {field => (
          <LoginField
            label="Email"
            testID="email-input"
            value={field.state.value}
            onBlur={field.handleBlur}
            onChangeText={field.handleChange}
            error={getFieldError(field)}
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
          />
        )}
      </form.Field>

      <form.Field name="password">
        {field => (
          <LoginField
            label="Password"
            testID="password-input"
            value={field.state.value}
            onBlur={field.handleBlur}
            onChangeText={field.handleChange}
            error={getFieldError(field)}
            autoCapitalize="none"
            autoComplete="password"
            placeholder="••••••••"
            secureTextEntry
          />
        )}
      </form.Field>

      <form.Subscribe selector={state => state.isSubmitting}>
        {isSubmitting => (
          <Button
            testID="login-button"
            isDisabled={isSubmitting}
            onPress={() => void form.handleSubmit()}
          >
            {isSubmitting && <ButtonSpinner />}
            <ButtonText>Login</ButtonText>
          </Button>
        )}
      </form.Subscribe>
    </VStack>
  );
}
