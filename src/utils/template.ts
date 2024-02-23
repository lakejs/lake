export function template(content: string) {
  return content.
    replace(/^\s+/gm, '').
    replace(/\s+$/gm, '').
    replace(/[\r\n]/g, '');
}
