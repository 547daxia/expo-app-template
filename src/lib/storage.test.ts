import {
  getItem,
  getString,
  removeItem,
  setItem,
  storage,
} from './storage';

describe('storage helpers', () => {
  beforeEach(() => {
    storage.clearAll();
  });

  it('round-trips JSON values without dropping falsy values', () => {
    setItem('false', false);
    setItem('zero', 0);
    setItem('object', { enabled: true });

    expect(getItem('false')).toBe(false);
    expect(getItem('zero')).toBe(0);
    expect(getItem('object')).toEqual({ enabled: true });
  });

  it('keeps the raw-string API distinct from JSON deserialization', () => {
    storage.set('raw-string', 'false');
    storage.set('legacy-json', JSON.stringify({ enabled: true }));

    expect(getString('raw-string')).toBe('false');
    expect(getItem('raw-string')).toBe(false);
    expect(getItem('legacy-json')).toEqual({ enabled: true });
  });

  it('returns null for missing values and removes stored values', () => {
    expect(getItem('missing')).toBeNull();

    setItem('temporary', 'value');
    removeItem('temporary');

    expect(getItem('temporary')).toBeNull();
  });

  it('returns null for malformed JSON values', () => {
    storage.set('malformed', 'not-json');

    expect(getItem('malformed')).toBeNull();
  });
});
