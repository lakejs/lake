import type { Nodes } from '../models/nodes';

// Removes empty marks that contain no content in the specified node.
export function removeEmptyMarks(node: Nodes): void {
  if (node.isMark && node.isEmpty) {
    node.remove();
    return;
  }
  for (const child of node.getWalker()) {
    if (child.isMark && child.isEmpty) {
      child.remove();
    }
  }
}
