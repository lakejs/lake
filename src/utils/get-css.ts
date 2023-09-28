import { NativeElement } from '../types/native';
import { camelCase } from '../utils/camel-case';
import { toHex } from '../utils/to-hex';

// Returns a property value of all CSS properties of an element
export function getCSS(element: NativeElement, propertyName: string): string {
  const camelPropertyName = camelCase(propertyName);
  const computedStyle = window.getComputedStyle(element, null);
  const propertyValue = element.style[camelPropertyName] || computedStyle.getPropertyValue(propertyName) || '';
  return toHex(propertyValue);
}
