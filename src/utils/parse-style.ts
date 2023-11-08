import { KeyValue } from '../types/object';
import { toHex } from './to-hex';

export function parseStyle(styleValue: string): KeyValue {
  styleValue = styleValue.replace(/&quot;/ig, '"');
  const properties: KeyValue = {};
  const re = /\s*([\w-]+)\s*:([^;]*)(;|$)/g;
  let match;
  while ((match = re.exec(styleValue)) !== null) {
    const key = match[1].toLowerCase().trim();
    const val = toHex(match[2]).trim();
    properties[key] = val;
  }
  return properties;
}
