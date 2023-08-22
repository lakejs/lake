import { query, parseStyle, forEach } from '../utils';
import { Range } from '../models/range';
import { getBlocks } from './get-blocks';
import { insertBookmark } from './insert-bookmark';
import { toBookmark } from './to-bookmark';

export function setBlocks(range: Range, value: string): void {
  const nodes = query(value);
  const tagName = nodes.name;
  const styleString = nodes.attr('style');
  const cssProperties = parseStyle(styleString);
  const blockList = getBlocks(range);
  const bookmark = insertBookmark(range);
  blockList.forEach(node => {
    const block = query(`<${tagName} />`);
    let child = node.first();
    while(child.length > 0) {
      const next = child.next();
      block.append(child);
      child = next;
    }
    node.replaceWith(block);
    forEach(cssProperties, (key, val) => {
      block.css(key, val);
    });
  });
  toBookmark(range, bookmark);
}
