import { NativeNode } from '../types/native';
import { query } from '../utils/query';
import { Nodes } from '../models/nodes';
import { Range } from '../models/range';

// Inserts a Node into the specified range.
export function insertNode(range: Range, node: NativeNode | Nodes): void {
  if (range.commonAncestor.isOutside) {
    return;
  }
  node = query(node);
  const nativeNode = node.get(0);
  const nativeRange = range.get();
  if (!range.isCollapsed) {
    nativeRange.deleteContents();
  }
  nativeRange.insertNode(nativeNode);
  nativeRange.setEndAfter(nativeNode);
  nativeRange.collapse(false);
}
