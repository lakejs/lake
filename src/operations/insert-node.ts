import { NativeNode } from '../types/native';
import { Nodes } from '../models/nodes';
import { Range } from '../models/range';

// Inserts a Node into the specified range.
export function insertNode(range: Range, node: NativeNode | Nodes): void {
  if (!range.commonAncestor.isContentEditable) {
    return;
  }
  if (node instanceof Nodes) {
    node = node.get(0);
  }
  const nativeRange = range.get();
  if (!range.isCollapsed) {
    nativeRange.deleteContents();
  }
  nativeRange.insertNode(node);
  nativeRange.setEndAfter(node);
  nativeRange.collapse(false);
}
