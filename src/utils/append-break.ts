import type { Nodes } from '../models/nodes';

// Appends a line break to the end of a block.
// Example:
// case 1: <p></p> to <p><br /></p>
// case 2: <p><br /></p> to <p><br /></p>
// case 3: <p>foo</p> to <p>foo<br /></p>
export function appendBreak(block: Nodes): void {
  if (block.length === 0) {
    return;
  }
  const nodeList: Nodes[] = [];
  let child = block.first();
  while (child.length > 0) {
    const nextNode = child.next();
    if (!child.isText || child.text() !== '') {
      nodeList.push(child);
    }
    child = nextNode;
  }
  if (
    nodeList.length === 1 &&nodeList[0].name === 'br' ||
    nodeList.length === 2 && nodeList[0].name === 'br' && nodeList[1].isBookmark
  ) {
    nodeList[0].remove();
  }
  if (nodeList.length === 2 && nodeList[0].isBookmark && nodeList[1].name === 'br') {
    nodeList[1].remove();
  }
}
