import type { Nodes } from '../models/nodes';

// Removes The <br /> element in the specified block which is empty.
export function removeBr(block: Nodes): void {
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
