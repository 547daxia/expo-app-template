import type { ComponentProps } from 'react';

import { useForm } from '@tanstack/react-form';
import { Stack } from 'expo-router';
import { showMessage } from 'react-native-flash-message';
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
import { ScrollView } from '@/components/ui/scroll-view';
import { Textarea, TextareaInput } from '@/components/ui/textarea';
import { VStack } from '@/components/ui/vstack';
import { queryClient } from '@/lib/api';
import { getFieldError } from '@/lib/form-utils';
import { navigate } from '@/lib/navigation';
import { useAddPost, usePosts } from './api';

const postSchema = z.object({
  title: z.string().min(10, 'Title must contain at least 10 characters'),
  body: z.string().min(120, 'Content must contain at least 120 characters'),
});

type PostFieldProps = {
  error?: string;
  label: string;
  children: React.ReactNode;
} & ComponentProps<typeof FormControl>;

function PostField({ error, label, children, ...props }: PostFieldProps) {
  return (
    <FormControl isInvalid={Boolean(error)} {...props}>
      <FormControlLabel>
        <FormControlLabelText>{label}</FormControlLabelText>
      </FormControlLabel>
      {children}
      {error && (
        <FormControlError>
          <FormControlErrorText selectable>{error}</FormControlErrorText>
        </FormControlError>
      )}
    </FormControl>
  );
}

export function AddPostScreen() {
  const { mutateAsync: addPost, isPending } = useAddPost();
  const form = useForm({
    defaultValues: { title: '', body: '' },
    validators: { onChange: postSchema },
    onSubmit: async ({ value }) => {
      try {
        const createdPost = await addPost({ ...value, userId: 1 });
        queryClient.setQueryData(usePosts.getKey(), (posts: Array<typeof createdPost> | undefined) => (
          [createdPost, ...(posts ?? [])]
        ));
        showMessage({ message: 'Post added successfully', type: 'success' });
        form.reset();
        navigate.back();
      }
      catch {
        showMessage({
          message: 'Unable to add post',
          description: 'Check your connection and try again.',
          type: 'danger',
        });
      }
    },
  });

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ padding: 20 }}
    >
      <Stack.Screen options={{ title: 'Add Post', headerBackTitle: 'Feed' }} />
      <VStack className="gap-5">
        <form.Field name="title">
          {field => (
            <PostField error={getFieldError(field)} label="Title">
              <Input>
                <InputField
                  testID="title"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChangeText={field.handleChange}
                  placeholder="A descriptive post title"
                />
              </Input>
            </PostField>
          )}
        </form.Field>

        <form.Field name="body">
          {field => (
            <PostField error={getFieldError(field)} label="Content">
              <Textarea className="min-h-48">
                <TextareaInput
                  testID="body-input"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChangeText={field.handleChange}
                  placeholder="Write at least 120 characters"
                />
              </Textarea>
            </PostField>
          )}
        </form.Field>

        <form.Subscribe selector={state => state.isSubmitting}>
          {isSubmitting => (
            <Button
              testID="add-post-button"
              isDisabled={isPending || isSubmitting}
              onPress={() => void form.handleSubmit()}
            >
              {(isPending || isSubmitting) && <ButtonSpinner />}
              <ButtonText>Add Post</ButtonText>
            </Button>
          )}
        </form.Subscribe>
      </VStack>
    </ScrollView>
  );
}
