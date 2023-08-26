import { query, parseStyle, forEach } from '../utils';
import { Nodes } from '../models/nodes';
import { Range } from '../models/range';
import { getBlocks } from './get-blocks';
import { insertBookmark } from './insert-bookmark';
import { toBookmark } from './to-bookmark';

function addStyles(block: Nodes, styleValue: string) {
  const cssProperties = parseStyle(styleValue);
  forEach(cssProperties, (key, val) => {
    block.css(key, val);
  });
}

// Splits text node and mark node.
// <p><strong>one<anchor />two<focus />three</strong></p>
// to
// <p><strong>one<strong><strong><anchor />two<focus /></strong><strong>three</strong></p>
function splitMark(range: Range) {
  const bookmark = insertBookmark(range);
  // TODO
  toBookmark(range, bookmark);
}

export function addMark(range: Range, value: string): void {
  const targetNode = query(value);
  const tagName = targetNode.name;
  const styleValue = targetNode.attr('style');
  const blockList = getBlocks(range);
  splitMark(range);
  // TODO
  const bookmark = insertBookmark(range);
  for (const node of blockList) {
    let block = node;
    if (node.name !== tagName) {
      block = query(`<${tagName} />`);
      let child = node.first();
      while(child.length > 0) {
        const next = child.next();
        block.append(child);
        child = next;
      }
      node.replaceWith(block);
    }
    addStyles(block, styleValue);
  }
  toBookmark(range, bookmark);
}
