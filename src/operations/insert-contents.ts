import { query } from '../utils';
import { Nodes } from '../models/nodes';
import { Range } from '../models/range';

export function insertContents(range: Range, value: string): Nodes {
  const node = query(value);
  range.insertNode(node);
  return node;
}
