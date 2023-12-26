import { query } from '../utils';
import { Range } from '../models/range';
import { Box } from '../models/box';

export function removeBox(range: Range): void {
  if (range.commonAncestor.isOutside) {
    return;
  }
  const boxNode = range.commonAncestor.closest('lake-box');
  if (boxNode.length === 0) {
    return;
  }
  const box = new Box(boxNode);
  if (box.type === 'block') {
    const paragraph = query('<p><br /></p>');
    boxNode.before(paragraph);
    range.shrinkAfter(paragraph);
    box.remove();
    return;
  }
  range.setStartBefore(boxNode);
  range.collapseToStart();
  box.remove();
}
