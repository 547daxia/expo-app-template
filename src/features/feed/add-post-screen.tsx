import { useForm } from '@tanstack/react-form';

import { Stack } from 'expo-router';
import * as React from 'react';
import { showMessage } from 'react-native-flash-message';
import * as z from 'zod';

import {
  Button,
  Input,
  showErrorMessage,
  View,
} from '@/components/ui';
import { getFieldError } from '@/components/ui/form-utils';
import { queryClient } from '@/lib/api';
import { useAddPost, usePosts } from './api';

const schema = z.object({
  title: z.string().min(10),
  body: z.string().min(120),
});

export function AddPostScreen() {
  const { mutate: addPost, isPending } = useAddPost();

  const form = useForm({
    defaultValues: {
      title: '',
      body: '',
    },

    validators: {
      onChange: schema as any,
    },
    onSubmit: ({ value }) => {
      addPost(
        { ...value, userId: 1 },
        {
          onSuccess: () => {
            showMessage({
              message: 'Post added successfully',
              type: 'success',
            });
            // Keep the feed in sync for consumers that are already mounted.
            queryClient.invalidateQueries({
              queryKey: usePosts.getKey(),
            });
          },
          onError: () => {
            showErrorMessage('Error adding post');
          },
        },
      );
    },
  });

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Add Post',
          headerBackTitle: 'Feed',
        }}
      />
      <View className="flex-1 p-4">
        <form.Field
          name="title"
        >
          {field => (
            <Input
              label="Title"
              testID="title"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChangeText={field.handleChange}
              error={getFieldError(field)}
            />
          )}
        </form.Field>
        <form.Field
          name="body"
        >
          {field => (
            <Input
              label="Content"
              multiline
              testID="body-input"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChangeText={field.handleChange}
              error={getFieldError(field)}
            />
          )}
        </form.Field>
        <form.Subscribe
          selector={state => [state.isSubmitting]}
        >
          {([isSubmitting]) => (
            <Button
              label="Add Post"
              loading={isPending || isSubmitting}
              onPress={form.handleSubmit}
              testID="add-post-button"
            />
          )}
        </form.Subscribe>
      </View>
    </>
  );
}
