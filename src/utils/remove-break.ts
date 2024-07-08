import type { Nodes } from '../models/nodes';

// Removes a line break in the specified empty block.
// Example:
// case 1: <p><br /></p> to <p></p>
// case 2: <p><br /><focus /></p> to <p><focus /></p>
// case 3: <p><focus /><br /></p> to <p><focus /></p>
export function removeBreak(block: Nodes): void {
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
