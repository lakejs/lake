// Converts the special tags to ordinary HTML tags that can be parsed by browser.
export function normalizeValue(value: string): string {
  return value.
    replace(/<anchor\s*\/>/ig, '<lake-bookmark type="anchor"></lake-bookmark>').
    replace(/<focus\s*\/>/ig, '<lake-bookmark type="focus"></lake-bookmark>');
}
