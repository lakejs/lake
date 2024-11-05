// Returns an array representing a list of the document's elements.
export function toNodeList(content: string | Node, valueType?: 'text' | 'html'): Node[] {
  const nodeList: Node[] = [];
  // a node
  if (typeof content !== 'string') {
    nodeList.push(content);
    return nodeList;
  }
  // empty string
  if (content === '') {
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
