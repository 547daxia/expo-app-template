import React from 'react';

import { cleanup, fireEvent, render, screen } from '@/lib/test-utils';
import {
  PromptInput,
  PromptInputBody,
  PromptInputButton,
  PromptInputProvider,
  PromptInputSubmit,
  PromptInputTextarea,
} from './prompt-input';

afterEach(cleanup);

describe('prompt input', () => {
  it('submits the current value and clears the textarea', () => {
    const onSubmit = jest.fn();

    render(
      <PromptInputProvider>
        <PromptInput onSubmit={onSubmit}>
          <PromptInputBody>
            <PromptInputTextarea testID="prompt-input" />
            <PromptInputSubmit />
          </PromptInputBody>
        </PromptInput>
      </PromptInputProvider>,
    );

    const input = screen.getByTestId('prompt-input');
    fireEvent.changeText(input, 'Summarize this file');
    fireEvent.press(screen.getByText('↑'));

    expect(onSubmit).toHaveBeenCalledWith({
      files: [],
      text: 'Summarize this file',
    });
    expect(input.props.value).toBe('');
  });

  it('forwards press handlers from tool buttons', () => {
    const onPress = jest.fn();

    render(<PromptInputButton onPress={onPress}>Attach</PromptInputButton>);
    fireEvent.press(screen.getByRole('button', { name: 'Attach' }));

    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
