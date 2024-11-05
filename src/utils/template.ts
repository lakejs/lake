// Is a tag function for removing whitespace or line terminator character.
export function template(strings: TemplateStringsArray, ...keys: any[]): string {
  let content = strings[0];
  for (let i = 0; i < keys.length; i++) {
    const key = String(keys[i]);
    content += key;
    content += strings[i + 1];
  }
  content = content.
    replace(/^\s+/gm, '').
    replace(/\s+$/gm, '').
    replace(/[\r\n]/g, '');
  return content;
}
