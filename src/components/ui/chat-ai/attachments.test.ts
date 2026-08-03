import {
  getAttachmentLabel,
  getMediaCategory,
} from './attachments-utils';

describe('chat attachments', () => {
  it.each([
    ['image/png', 'image'],
    ['video/mp4', 'video'],
    ['audio/mpeg', 'audio'],
    ['application/pdf', 'document'],
    ['text/plain', 'document'],
    ['chemical/x-pdb', 'unknown'],
  ] as const)('classifies %s as %s', (mediaType, expected) => {
    expect(getMediaCategory({
      id: 'file-1',
      type: 'file',
      mediaType,
      url: 'file://example',
    })).toBe(expected);
  });

  it('uses source titles and file names as accessible labels', () => {
    expect(getAttachmentLabel({
      id: 'source-1',
      type: 'source-document',
      sourceId: 'document-1',
      mediaType: 'text/plain',
      title: 'Architecture notes',
      filename: 'notes.txt',
    })).toBe('Architecture notes');

    expect(getAttachmentLabel({
      id: 'file-1',
      type: 'file',
      mediaType: 'application/pdf',
      filename: 'brief.pdf',
      url: 'file://brief.pdf',
    })).toBe('brief.pdf');
  });
});
