// Converts the custom HTML tags to the special tags that can not be parsed by browser.
export function denormalizeValue(value: string): string {
  return value.
    replace(/(<lake-box[^>]+>)[\s\S]*?(<\/lake-box>)/ig, '$1$2').
    replace(/<lake-bookmark\s+type="anchor">\s*<\/lake-bookmark>/ig, '<anchor />').
    replace(/<lake-bookmark\s+type="focus">\s*<\/lake-bookmark>/ig, '<focus />');
}
