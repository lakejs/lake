import type { Nodes } from '../models/nodes';

// Returns the deepest element of the specified element.
export function getDeepElement(element: Nodes): Nodes {
  let child = element;
  while (child.length > 0) {
    let firstChild = child.first();
    if (firstChild.isText && firstChild.isEmpty) {
      firstChild = firstChild.next();
    }
    if (child.isElement && !child.isVoid && firstChild.length === 0) {
      break;
    }
    child = firstChild;
  }
  return child;
}
