export function clampImageIndex(index: number, imageCount: number): number {
  if (imageCount <= 0) {
    return 0;
  }
  return Math.min(Math.max(index, 0), imageCount - 1);
}
