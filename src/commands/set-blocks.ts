import { query, getAllCss, forEach } from '../utils';
import { Nodes } from '../models/nodes';
import { Range } from '../models/range';

export function setBlocks(range: Range, value: string): Nodes {
  range.debug();
  const nodes = query(value);
  const tagName = nodes.name;
  const styleString = nodes.attr('style');
  const cssProperties = getAllCss(styleString);
  range.allNodes().forEach(node => {
    if (!node.isBlock) {
      return;
    }
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
  return nodes;
}
