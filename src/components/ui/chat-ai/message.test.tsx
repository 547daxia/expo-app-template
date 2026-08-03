import type { UIMessage } from 'ai';

import { cleanup, render, screen } from '@/lib/test-utils';
import { MessageResponse } from './message';

afterEach(cleanup);

function createMessage(parts: UIMessage['parts']): UIMessage {
  return {
    id: 'message-1',
    role: 'assistant',
    parts,
  };
}

describe('message response', () => {
  it('renders text and image parts', () => {
    render(
      <MessageResponse
        message={createMessage([
          { type: 'text', text: 'Hello **world**' },
          {
            type: 'file',
            filename: 'diagram.png',
            mediaType: 'image/png',
            url: 'https://example.com/diagram.png',
          },
        ])}
      />,
    );

    expect(screen.getByText('Hello ')).toBeOnTheScreen();
    expect(screen.getByLabelText('diagram.png')).toBeOnTheScreen();
  });

  it.each([
    ['application/pdf', 'brief.pdf'],
    ['audio/mpeg', 'recording.mp3'],
    ['video/mp4', 'demo.mp4'],
    ['', 'Attachment'],
  ])('renders %s files as a file card', (mediaType, filename) => {
    render(
      <MessageResponse
        message={createMessage([{
          type: 'file',
          filename: filename === 'Attachment' ? undefined : filename,
          mediaType,
          url: `file://${filename}`,
        }])}
      />,
    );

    expect(screen.getByText(filename)).toBeOnTheScreen();
  });

  it('shows a pending state when no supported parts exist', () => {
    render(<MessageResponse message={createMessage([])} />);

    expect(screen.getByText('Thinking...')).toBeOnTheScreen();
  });
});
