import { getInstanceMap } from '../storage/box-instances';
import { appendBreak } from '../utils/append-break';
import { query } from '../utils/query';
import { getBox } from '../utils/get-box';
import { Range } from '../models/range';
import { Box } from '../models/box';

function unmountBox(box: Box): Box {
  const container = box.node.closestContainer();
  box.unmount();
  box.node.remove();
  if (container.length > 0) {
    // move the box instance from permanent map to temporary map
    const instanceMap = getInstanceMap(container.id);
    instanceMap.delete(box.node.id);
    const tempInstanceMap = getInstanceMap(0);
    tempInstanceMap.set(box.node.id, box);
  }
  return box;
}

/**
 * Removes a box that contains the specified range.
 */
export function removeBox(range: Range): Box | null {
  if (range.commonAncestor.isOutside) {
    return null;
  }
  const boxNode = range.commonAncestor.closest('lake-box');
  if (boxNode.length === 0) {
    return null;
  }
  const box = getBox(boxNode);
  if (box.type === 'block') {
    const paragraph = query('<p><br /></p>');
    boxNode.before(paragraph);
    range.shrinkAfter(paragraph);
    return unmountBox(box);
  }
  range.setStartBefore(boxNode);
  range.collapseToStart();
  const parentNode = boxNode.parent();
  unmountBox(box);
  if (parentNode.isEmpty) {
    const breakNode = appendBreak(parentNode);
    range.setStartBefore(breakNode);
    range.collapseToStart();
  }
  return box;
}
