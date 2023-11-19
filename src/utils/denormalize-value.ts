// Converts the custom HTML tags to the special tags that can not be parsed by browser.
export function denormalizeValue(value: string): string {
  return value.
    replace(/(<figure[^>]+>)[\s\S]*?(<\/figure>)/ig, '$1$2').
    replace(/<bookmark\s+type="anchor">\s*<\/bookmark>/ig, '<anchor />').
    replace(/<bookmark\s+type="focus">\s*<\/bookmark>/ig, '<focus />');
}
