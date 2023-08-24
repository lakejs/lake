import { query, parseStyle, forEach } from '../utils';
import { Nodes } from '../models/nodes';
import { Range } from '../models/range';
import { getBlocks } from './get-blocks';
import { insertBookmark } from './insert-bookmark';
import { toBookmark } from './to-bookmark';

function getTopNonBlockNodes(range: Range): Nodes[] {
  const container = range.commonAncestor.closest('div[contenteditable="true"]');
  let nodeList: Nodes[] = [];
  let node = container.first();
  let isPassedRange = false;
  while (node.length > 0) {
    if (node.isMark || node.isText) {
      nodeList.push(node);
    } else {
      if (isPassedRange) {
        break;
      }
      nodeList = [];
    }
    if (range.intersectsNode(node)) {
      nodeList.push(node);
      isPassedRange = true;
    }
    node = node.next();
  }
  return nodeList;
}

function addStyles(block: Nodes, styleValue: string) {
  const cssProperties = parseStyle(styleValue);
  forEach(cssProperties, (key, val) => {
    block.css(key, val);
  });
}

export function setBlocks(range: Range, value: string): void {
  const targetNode = query(value);
  const tagName = targetNode.name;
  const styleValue = targetNode.attr('style');
  const blockList = getBlocks(range);
  // no block
  if (blockList.length === 0) {
    const bookmark = insertBookmark(range);
    const nonBlockNodes = getTopNonBlockNodes(range);
    const block = query(`<${tagName} />`);
    addStyles(block, styleValue);
    nonBlockNodes[0].parent().get(0).insertBefore(block.get(0), nonBlockNodes[0].get(0));
    nonBlockNodes.forEach((node, index) => {
      if (node.isText) {
        const nodeValue = node.get(0).nodeValue || '';
        if (index === 0) {
          node.get(0).nodeValue = nodeValue.replace(/^[\s\r\n]+/, '');
        } else if (index === nonBlockNodes.length - 1) {
          node.get(0).nodeValue = nodeValue.replace(/[\s\r\n]+$/, '');
        }
      }
      block.append(node);
    });
    toBookmark(range, bookmark);
    return;
  }
  const bookmark = insertBookmark(range);
  blockList.forEach(node => {
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
  });
  toBookmark(range, bookmark);
}
