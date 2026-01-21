/**
 * Converts the special tags to ordinary HTML tags that can be parsed by browser.
 */
export function normalizeValue(value: string): string {
  const combinedRegex = /(<lake-box[^>]+>)[\s\S]*?(?:<\/lake-box>|$)|(<anchor\s*\/>)|(<focus\s*\/>)/gi;
  return value.replace(combinedRegex, (match, boxOpen, anchorMatch, focusMatch) => {
    if (boxOpen) {
      return `${boxOpen}</lake-box>`;
    }
    if (anchorMatch) {
      return '<lake-bookmark type="anchor"></lake-bookmark>';
    }
    if (focusMatch) {
      return '<lake-bookmark type="focus"></lake-bookmark>';
    }
    return match;
  });
}
