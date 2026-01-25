/**
 * Converts the custom HTML tags to the special tags that can not be parsed by browser.
 */
export function denormalizeValue(value: string): string {
  const combinedRegex = /(<lake-box[^>]+>)[\s\S]*?<\/lake-box>|<lake-bookmark\s+type="(anchor|focus)">\s*<\/lake-bookmark>/gi;
  return value.replace(combinedRegex, (match, boxOpen, bookmarkType) => {
    if (boxOpen) {
      return `${boxOpen}</lake-box>`;
    }
    if (bookmarkType === 'anchor') {
      return '<anchor />';
    }
    if (bookmarkType === 'focus') {
      return '<focus />';
    }
    return match;
  });
}
