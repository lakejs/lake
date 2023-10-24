const characterMap = new Map([
  ['&', '&amp;'],
  ['<', '&lt;'],
  ['>', '&gt;'],
  ['"', '&quot;'],
  ['\xA0', '&nbsp;'],
]);

// Converts all of the reserved characters in the specified string to HTML entities.
export function encode(value: string): string {
  return value.replace(/[&<>"\xA0]/g, match => characterMap.get(match) ?? '');
}
