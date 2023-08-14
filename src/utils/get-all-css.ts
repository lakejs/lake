import { toHex } from './to-hex';

export function getAllCss(value: string): object {
  value = value.replace(/&quot;/g, '"');
  const properties: { [key: string]: string } = {};
  const expression = /\s*([\w-]+)\s*:([^;]*)(;|$)/g;
  let match;
  while ((match = expression.exec(value))) {
    const key = match[1].toLowerCase().trim();
    const val = toHex(match[2]).trim();
    properties[key] = val;
  }
  return properties;
}
