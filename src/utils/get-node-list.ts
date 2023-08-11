
import { NativeNode } from '../types/native';

export function getNodeList(value: string | NativeNode, valueType?: 'text' | 'html'): NativeNode[] {
  const nodeList: NativeNode[] = [];
  // a node
  if (typeof value !== 'string') {
    nodeList.push(value);
    return nodeList;
  }
  // text string
  if (valueType === 'text') {
    const textNode = document.createTextNode(value);
    nodeList.push(textNode);
    return nodeList;
  }
  // HTML string
  if (valueType === 'html' || /<.+>/.test(value)) {
    const container = document.createElement('div');
    container.innerHTML = value;
    for (const child of container.childNodes) {
      nodeList.push(child);
    }
    return nodeList;
  }
  // selector string
  const elements = document.querySelectorAll(value);
  for (const child of elements) {
    nodeList.push(child);
  }
  return nodeList;
}
