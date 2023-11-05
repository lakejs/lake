import { fixNumberedList } from '../utils';
import { Range } from '../models/range';
import { getBlocks } from './get-blocks';

export function fixList(range: Range): void {
  if (!range.commonAncestor.isContentEditable) {
    return;
  }
  const blocks = getBlocks(range);
  fixNumberedList(blocks);
}
