// Returns a human-readable file size string from a number.
export function fileSize(size: number): string {
  const units = ['KB', 'MB', 'GB'];
  let i = 0;
  size /= 1024;
  while (size > 1024 && i < 2) {
    size /= 1024;
    i++;
  }
  const sizeString = size > 0 ? Math.max(size, 0.1).toFixed(1) : 0;
  return `${sizeString} ${units[i]}`;
}
