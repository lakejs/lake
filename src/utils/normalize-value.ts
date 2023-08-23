// Converts the special tags to ordinary HTML tags that can be parsed by browser.
export function normalizeValue(value: string): string {
  return value.
    replace(/<anchor\s*\/>/ig, '<bookmark type="anchor"></bookmark>').
    replace(/<focus\s*\/>/ig, '<bookmark type="focus"></bookmark>');
}
