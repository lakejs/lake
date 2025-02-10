import { encode } from './encode';

// A tag function for converting all of the reserved characters in the specified string to HTML entities.
export function template(strings: TemplateStringsArray, ...keys: any[]): string {
  let content = strings[0];
  for (let i = 0; i < keys.length; i++) {
    const key = String(keys[i]);
    // Escape special characters in the substitution.
    content += encode(key);
    // Don't escape special characters in the template.
    content += strings[i + 1];
  }
  content = content
    .replace(/^\s+/gm, '')
    .replace(/\s+$/gm, '')
    .replace(/[\r\n]/g, '');
  return content;
}
