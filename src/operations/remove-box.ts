import { appendDeepest, query } from '../utils';
import { Range } from '../models/range';
import { Box } from '../models/box';

export function removeBox(range: Range): Box | null {
  if (range.commonAncestor.isOutside) {
    return null;
  }
  const boxNode = range.commonAncestor.closest('lake-box');
  if (boxNode.length === 0) {
    return null;
  }
  const box = new Box(boxNode);
  if (box.type === 'block') {
    const paragraph = query('<p><br /></p>');
    boxNode.before(paragraph);
    range.shrinkAfter(paragraph);
    box.unmount();
    boxNode.remove();
    return box;
  }
  range.setStartBefore(boxNode);
  range.collapseToStart();
  const parentNode = boxNode.parent();
  box.unmount();
  boxNode.remove();
  if (parentNode.isEmpty) {
    appendDeepest(parentNode, query('<br />'));
    range.shrinkAfter(parentNode);
  }
  return box;
}
