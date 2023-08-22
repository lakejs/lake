import { toHex } from './to-hex';

type PropertiesType = { [key: string]: string };

export function parseStyle(styleValue: string): PropertiesType {
  styleValue = styleValue.replace(/&quot;/ig, '"');
  const properties: PropertiesType = {};
  const expression = /\s*([\w-]+)\s*:([^;]*)(;|$)/g;
  let match;
  while ((match = expression.exec(styleValue))) {
    const key = match[1].toLowerCase().trim();
    const val = toHex(match[2]).trim();
    properties[key] = val;
  }
  return properties;
}
