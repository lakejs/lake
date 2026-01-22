import { encode } from './encode';

/**
 * A tag function that converts all of the reserved characters in the specified string to HTML entities.
 * It also removes empty spaces at the beginning and end of lines.
 */
export function template(strings: TemplateStringsArray, ...keys: any[]): string {
  let content = strings[0];
  for (let i = 0; i < keys.length; i++) {
    const key = String(keys[i]);
    // Escape special characters in the substitution.
    content += encode(key);
    // Don't escape special characters in the template.
    content += strings[i + 1];
  }
  return content.replace(/^\s+|\s+$|[\r\n]/gm, '');
}
