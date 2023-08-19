import { toHex } from './to-hex';

export function getAllCss(styleValue: string): object {
  styleValue = styleValue.replace(/&quot;/ig, '"');
  const properties: { [key: string]: string } = {};
  const expression = /\s*([\w-]+)\s*:([^;]*)(;|$)/g;
  let match;
  while ((match = expression.exec(styleValue))) {
    const key = match[1].toLowerCase().trim();
    const val = toHex(match[2]).trim();
    properties[key] = val;
  }
  return properties;
}
