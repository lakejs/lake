
import { NativeNode } from '../types/native';

export function getFragment(value: string | NativeNode, valueType?: 'text' | 'html'): DocumentFragment {
  const fragment = document.createDocumentFragment();
  // a node
  if (typeof value !== 'string') {
    fragment.appendChild(value);
    return fragment;
  }
  // text string
  if (valueType === 'text') {
    const textNode = document.createTextNode(value);
    fragment.appendChild(textNode);
    return fragment;
  }
  // HTML string
  if (valueType === 'html' || /<.+>/.test(value)) {
    const container = document.createElement('div');
    container.innerHTML = value;
    for (const child of container.childNodes) {
      fragment.appendChild(child);
    }
    return fragment;
  }
  // selector string
  const elements = document.querySelectorAll(value);
  for (const child of elements) {
    fragment.appendChild(child);
  }
  return fragment;
}
