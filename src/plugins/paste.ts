import type Editor from '..';
import { HTMLParser, TextParser, Nodes, Range, Selection } from '../models';

function selectLastChild(range: Range, lastNode: Nodes): void {
  if (!lastNode.isBlock) {
    range.setEndAfter(lastNode);
    range.collapseToEnd();
    return;
  }
  range.selectNodeContents(lastNode);
  range.reduce();
  range.collapseToEnd();
}

function insertFirstNode(selection: Selection, otherNode: Nodes): void {
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

function pastePlainText(editor: Editor, fragment: DocumentFragment): void {
  const selection = editor.selection;
  const range = selection.range;
  const blocks = selection.getBlocks();
  if (fragment.childNodes.length === 0) {
    return;
  }
  const firstNode = new Nodes(fragment.firstChild);
  const lastNode = new Nodes(fragment.lastChild);
  if (blocks.length === 0) {
    selection.setBlocks('<p />');
  }
  if (firstNode.isBlock) {
    insertFirstNode(selection, firstNode);
  }
  if (fragment.childNodes.length > 0) {
    const parts = selection.splitBlock();
    if (parts.left) {
      range.setEndAfter(parts.left);
      range.collapseToEnd();
    }
    selection.insertFragment(fragment);
    selectLastChild(range, lastNode);
  }
}

function pasteHTML(editor: Editor, fragment: DocumentFragment): void {
  const selection = editor.selection;
  const range = selection.range;
  const blocks = selection.getBlocks();
  if (fragment.childNodes.length === 0) {
    return;
  }
  const firstNode = new Nodes(fragment.firstChild);
  const lastNode = new Nodes(fragment.lastChild);
  if (blocks.length === 0) {
    selection.setBlocks('<p />');
  }
  if (firstNode.isBlock) {
    insertFirstNode(selection, firstNode);
  }
  if (fragment.childNodes.length > 0) {
    const parts = selection.splitBlock();
    if (parts.left) {
      range.setEndAfter(parts.left);
      range.collapseToEnd();
    }
    selection.insertFragment(fragment);
    selectLastChild(range, lastNode);
  }
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
      pastePlainText(editor, fragment);
      return;
    }
    const content = dataTransfer.getData('text/html');
    const htmlParser = new HTMLParser(content);
    const fragment = htmlParser.getFragment();
    pasteHTML(editor, fragment);
  });
};
