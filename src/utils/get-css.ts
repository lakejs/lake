import { camelCase } from './camel-case';
import { toHex } from './to-hex';

// Returns a property value of all CSS properties of an element
export function getCSS(element: Element, propertyName: string): string {
  const camelPropertyName = camelCase(propertyName);
  const computedStyle = window.getComputedStyle(element, null);
  const propertyValue = element.style[camelPropertyName] || computedStyle.getPropertyValue(propertyName) || '';
  return toHex(propertyValue);
}
