import { NativeNode } from '../types/native';

export function toNodeList(content: string | NativeNode, valueType?: 'text' | 'html'): NativeNode[] {
  const nodeList: NativeNode[] = [];
  // a node
  if (typeof content !== 'string') {
    nodeList.push(content);
    return nodeList;
  }
  // text string
  if (valueType === 'text') {
    const textNode = document.createTextNode(content);
    nodeList.push(textNode);
    return nodeList;
  }
  // HTML string
  if (valueType === 'html' || /<.+>/.test(content)) {
    const container = document.createElement('div');
    container.innerHTML = content;
    for (const child of container.childNodes) {
      nodeList.push(child);
    }
    return nodeList;
  }
  // selector string
  const elements = document.querySelectorAll(content);
  for (const child of elements) {
    nodeList.push(child);
  }
  return nodeList;
}
