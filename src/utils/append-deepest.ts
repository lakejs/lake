import type { Nodes } from '../models/nodes';

// Appends a node to the deepest element of the specified element.
export function appendDeepest(element: Nodes, node: Nodes): void {
  let child = element;
  while (child.length > 0) {
    let firstChild = child.first();
    while (firstChild.isText && firstChild.isEmpty) {
      firstChild = firstChild.next();
    }
    if (child.isText || child.isBox) {
      break;
    }
    if (child.isElement && child.children().length === 1 && firstChild.isBookmark) {
      child.prepend(node);
      break;
    }
    if (child.isElement && !child.isVoid && firstChild.length === 0) {
      child.append(node);
      break;
    }
    child = firstChild;
  }
}
