import { query } from '../models/query';
import { Range } from '../models/range';

export function insertContents(range: Range, value: string) {
  const nodes = query(value);
  range.insert(nodes);
}
