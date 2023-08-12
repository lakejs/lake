import { query } from '../models/query';
import { Range } from '../models/range';
import { Nodes } from '../models/nodes';

export function insertContents(range: Range, value: string): Nodes {
  const nodes = query(value);
  range.insertNode(nodes);
  return nodes;
}
