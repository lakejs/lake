import { Nodes } from '../models/nodes';
import { Range } from '../models/range';
import { insertBookmark } from './insert-bookmark';
import { toBookmark } from './to-bookmark';

// Splits elements upwards according to the position until a limiting element is encountered.
function splitElement(node: Nodes, offset: number, limit: Nodes): Nodes {
  const range = new Range();
  range.setStart(node, offset);
  range.collapseToStart();
  const bookmark = insertBookmark(range);
  const focus = bookmark.focus;
  const parent = focus.parent();
  if (parent.get(0) === limit.get(0)) {
    toBookmark(range, bookmark);
    return node;
  }
  const newParent = parent.clone();
  let child = parent.first();
  while (child.length > 0) {
    if (child.get(0) === focus.get(0)) {
      break;
    }
    newParent.append(child);
    child = child.next();
  }
  parent.before(newParent);
  toBookmark(range, bookmark);
  return newParent;
}

// Splits text nodes or mark nodes.
// <p><strong>one<anchor />two<focus />three</strong></p>
// to
// <p><strong>one</strong><strong><anchor />two<focus /></strong><strong>three</strong></p>
export function splitMarks(range: Range): void {
  if (range.isCollapsed) {
    const block = range.startNode.closestBlock();
    const beforeParent = splitElement(range.startNode, range.startOffset, block);
    const emptyMark = beforeParent.clone();
    emptyMark.html('');
    beforeParent.after(emptyMark);
    range.setStart(emptyMark, 0);
    range.collapseToStart();
    return;
  }
  const startBlock = range.startNode.closestBlock();
  splitElement(range.startNode, range.startOffset, startBlock);
  const endBlock = range.endNode.closestBlock();
  const beforeParent = splitElement(range.endNode, range.endOffset, endBlock);
  range.selectNodeContents(beforeParent);
}
