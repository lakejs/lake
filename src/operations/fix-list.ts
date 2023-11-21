import { fixNumberedList } from '../utils';
import { Range } from '../models/range';
import { getBlocks } from './get-blocks';

export function fixList(range: Range): void {
  if (range.commonAncestor.isOutside) {
    return;
  }
  const blocks = getBlocks(range);
  fixNumberedList(blocks);
}
