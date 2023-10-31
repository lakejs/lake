import type Editor from '..';
import { NativeElement } from '../types/native';
import { blockTagNames } from '../constants/tag-names';
import { getDefaultRules } from '../constants/schema';
import { forEach, query, wrapNodeList } from '../utils';
import { HTMLParser, TextParser, Nodes, Selection } from '../models';

const blockSelector = Array.from(blockTagNames).join(',');

function replaceTagName(element: Nodes, newTagName: string): Nodes {
  const nativeValueNode = element.get(0) as NativeElement;
  const attributes = nativeValueNode.attributes;
  const newElement = query(`<${newTagName} />`);
  for (const attr of attributes) {
    newElement.attr(attr.name, attr.value);
  }
  let child = element.first();
  while(child.length > 0) {
    const nextNode = child.next();
    newElement.append(child);
    child = nextNode;
  }
  element.replaceWith(newElement);
  return newElement;
}

function fixNestedBlocks(block: Nodes): void {
  const nodeList = [ block ];
  for  (const node of block.getWalker()) {
    nodeList.push(node);
  }
  for (const node of nodeList) {
    if (node.name === 'div') {
      if (node.find(blockSelector).length > 0) {
        node.remove(true);
      } else {
        replaceTagName(node, 'p');
      }
    }
    if (node.isHeading) {
      const blocks = node.find(blockSelector);
      if (blocks.length > 0) {
        blocks.remove(true);
      }
    }
  }
}

function fixClipboardData(fragment: DocumentFragment): void {
  let node = new Nodes(fragment.firstChild);
  while (node.length > 0) {
    const nextNode = node.next();
    if (node.isBlock) {
      fixNestedBlocks(node);
    }
    node = nextNode;
  }
  let nodeList: Nodes[] = [];
  node = new Nodes(fragment.firstChild);
  while (node.length > 0) {
    const nextNode = node.next();
    if (node.isMark || node.isText || node.isBookmark) {
      nodeList.push(node);
    } else {
      wrapNodeList(nodeList);
      nodeList = [];
    }
    node = nextNode;
  }
  wrapNodeList(nodeList);
}

function insertFirstNode(selection: Selection, otherNode: Nodes): void {
  const range = selection.range;
  const block = range.startNode.closestBlock();
  // <p><br /></p>
  if (
    block.first().length > 0 && block.first().get(0) === block.last().get(0) &&
    block.first().name === 'br' && otherNode.first().length > 0
  ) {
    block.empty();
  }
  if (block.isEmpty && block.name === 'p') {
    block.replaceWith(otherNode);
    range.selectAfterNodeContents(otherNode);
    return;
  }
  let child = otherNode.first();
  while(child.length > 0) {
    if (child.name === 'li') {
      child = child.first();
    }
    const nextSibling = child.next();
    selection.insertNode(child);
    child = nextSibling;
  }
  otherNode.remove();
}

function pasteFragment(editor: Editor, fragment: DocumentFragment): void {
  const selection = editor.selection;
  const range = selection.range;
  if (fragment.childNodes.length === 0) {
    return;
  }
  const firstNode = new Nodes(fragment.firstChild);
  let lastNode = new Nodes(fragment.lastChild);
  if (selection.getBlocks().length === 0) {
    selection.setBlocks('<p />');
  }
  // remove br element
  const block = range.startNode.closestBlock();
  if (block.length > 0 && block.isEmpty) {
    block.empty();
  }
  // is mark or text
  if (!firstNode.isBlock) {
    selection.insertFragment(fragment);
    editor.history.save();
    editor.select();
    return;
  }
  // is block
  if (firstNode.isBlock) {
    insertFirstNode(selection, firstNode);
  }
  // remove br
  let child = new Nodes(fragment.firstChild);
  while (child.length > 0) {
    const next = child.next();
    if (child.name === 'br') {
      child.remove();
    }
    child = next;
  }
  lastNode = new Nodes(fragment.lastChild);
  // insert fragment
  if (fragment.childNodes.length > 0) {
    const parts = selection.splitBlock();
    if (parts.left) {
      range.setEndAfter(parts.left);
      range.collapseToEnd();
    }
    if (parts.right && parts.right.isEmpty) {
      parts.right.remove();
    }
    selection.insertFragment(fragment);
    range.selectAfterNodeContents(lastNode);
  }
  editor.history.save();
  editor.select();
}

export default (editor: Editor) => {
  editor.container.on('paste', event => {
    event.preventDefault();
    const dataTransfer = (event as ClipboardEvent).clipboardData;
    if (!dataTransfer) {
      return;
    }
    editor.selection.deleteContents();
    const types = dataTransfer.types;
    const isPlainText = (types.length === 1 && types[0] === 'text/plain');
    if (isPlainText) {
      const content = dataTransfer.getData('text/plain');
      const textParser = new TextParser(content);
      const fragment = textParser.getFragment();
      pasteFragment(editor, fragment);
      return;
    }
    const content = dataTransfer.getData('text/html');
    const rules = getDefaultRules();
    rules.div = rules.p;
    forEach(rules, (key, attributeRules) => {
      delete attributeRules.id;
      delete attributeRules.class;
    });
    const htmlParser = new HTMLParser(content, rules);
    const fragment = htmlParser.getFragment();
    fixClipboardData(fragment);
    pasteFragment(editor, fragment);
  });
};
