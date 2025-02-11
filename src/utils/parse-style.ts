import { KeyValue } from '../types/object';
import { toHex } from './to-hex';

// Converts a string from style property of element to a key-value object that contains a list of all styles properties.
export function parseStyle(styleValue: string): KeyValue {
  styleValue = styleValue.replace(/&quot;/gi, '"');
  const properties: KeyValue = {};
  const re = /\s*([\w-]+)\s*:([^;]*)(?:;|$)/g;
  let result;
  while ((result = re.exec(styleValue)) !== null) {
    const key = result[1].toLowerCase().trim();
    const val = toHex(result[2]).trim();
    properties[key] = val;
  }
  return properties;
}
