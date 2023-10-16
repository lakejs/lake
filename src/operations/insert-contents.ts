import { NativeNode } from '../types/native';
import { query } from '../utils';
import { Nodes } from '../models/nodes';
import { Range } from '../models/range';
import { deleteContents } from './delete-contents';

// Inserts a HTML string into the specified range.
export function insertContents(range: Range, value: string | NativeNode | Nodes): Nodes {
  const nodes = query(value);
  if (!range.commonAncestor.isContentEditable) {
    return nodes;
  }
  if (!range.isCollapsed) {
    deleteContents(range);
  }
  nodes.each(node => {
    const nativeRange = range.get();
    nativeRange.insertNode(node);
    nativeRange.selectNode(node);
    nativeRange.collapse(false);
  });
  return nodes;
}
