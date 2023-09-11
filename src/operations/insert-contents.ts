import { NativeNode } from '../types/native';
import { query } from '../utils';
import { Nodes } from '../models/nodes';
import { Range } from '../models/range';

// Inserts a HTML string into the specified range.
export function insertContents(range: Range, value: string | NativeNode | Nodes): Nodes {
  const node = query(value);
  range.insertNode(node);
  return node;
}
