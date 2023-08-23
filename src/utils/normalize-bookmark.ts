// Changes the special bookmark tags to ordinary HTML tags that can be parsed by browser.
export function normalizeBookmark(value: string): string {
  return value.
    replace(/<anchor\s*\/>/ig, '<bookmark type="anchor"></bookmark>').
    replace(/<focus\s*\/>/ig, '<bookmark type="focus"></bookmark>');
}
