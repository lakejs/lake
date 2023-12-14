import { query } from '../utils';
import { Range } from '../models/range';
import { Box } from '../models/box';

export function removeBox(range: Range): void {
  if (range.commonAncestor.isOutside) {
    return;
  }
  if (!range.isBox) {
    return;
  }
  const boxNode = range.startNode.closest('lake-box');
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
