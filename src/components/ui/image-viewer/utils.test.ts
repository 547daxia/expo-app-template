import { clampImageIndex } from './utils';

describe('clampImageIndex', () => {
  it.each([
    [-2, 3, 0],
    [0, 3, 0],
    [1, 3, 1],
    [9, 3, 2],
    [3, 0, 0],
  ])('clamps index %s for %s images', (index, count, expected) => {
    expect(clampImageIndex(index, count)).toBe(expected);
  });
});
