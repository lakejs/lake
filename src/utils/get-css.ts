import { NativeElement } from '../types/native';
import { camelCase } from '../utils/camel-case';
import { toHex } from '../utils/to-hex';
import { getWindow } from '../utils/get-window';

// Returns a property value of all CSS properties of an element
export function getCss(element: NativeElement, propertyName: string): string {
  const win = getWindow(element);
  const camelPropertyName = camelCase(propertyName);
  const computedStyle = win.getComputedStyle(element, null);
  const propertyValue = element.style[camelPropertyName] || computedStyle.getPropertyValue(propertyName) || '';
  return toHex(propertyValue);
}
