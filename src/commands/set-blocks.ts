import { query, getAllCss, forEach, debug } from '../utils';
import { Nodes } from '../models/nodes';
import { Range } from '../models/range';

export function setBlocks(range: Range, value: string): Nodes {
  const nodes = query(value);
  const styleString = nodes.attr('style');
  const cssProperties = getAllCss(styleString);
  const startBlock = range.startNode.closest('div,p,blockquote');
  const endBlock = range.startNode.closest('div,p,blockquote');
  forEach(cssProperties, (key, val) => {
    debug(key, val, startBlock, endBlock);
  });
  // const tagName = nodes.name(0);
  return nodes;
}
