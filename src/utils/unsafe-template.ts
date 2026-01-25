/**
 * A tag function that removes empty spaces at the beginning and end of lines or line terminator character.
 */
export function unsafeTemplate(strings: TemplateStringsArray, ...keys: any[]): string {
  let content = strings[0];
  for (let i = 0; i < keys.length; i++) {
    const key = String(keys[i]);
    content += key;
    content += strings[i + 1];
  }
  return content.replace(/^\s+|\s+$|[\r\n]/gm, '');
}
