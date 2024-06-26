import { query } from '../utils/query';
import { Nodes } from '../models/nodes';
import { Range } from '../models/range';

// Inserts a node into the specified range.
export function insertNode(range: Range, node: Node | Nodes): void {
  if (range.commonAncestor.isOutside) {
    return;
  }
  node = query(node);
  const nativeNode = node.get(0);
  const nativeRange = range.get();
  nativeRange.insertNode(nativeNode);
  nativeRange.setEndAfter(nativeNode);
  nativeRange.collapse(false);
}
