import type Editor from '..';
import { query } from '../utils';
import { HTMLParser, TextParser } from '../models';

function pastePlainText(editor: Editor, content: string) {
  const selection = editor.selection;
  const range = selection.range;
  const blocks = selection.getBlocks();
  const textParser = new TextParser(content);
  const fragment = textParser.getFragment();
  if (!fragment.lastChild) {
    return;
  }
  const firstNode = query(fragment.lastChild);
  const lastNode = query(fragment.lastChild);
  if (blocks.length === 0) {
    selection.insertFragment(fragment);
    if (lastNode.isBlock) {
      range.selectNodeContents(lastNode);
      range.reduce();
      range.collapseToEnd();
    }
    return;
  }
  // TODO
  if (blocks[0].isBlock && !blocks[0].isList && firstNode.isBlock) {
    // firstNode.remove(true);
    // selection.insertNode(firstNode);
  }
  selection.insertFragment(fragment);
}

function pasteHTML(editor: Editor, content: string) {
  const htmlParser = new HTMLParser(content);
  const fragment = htmlParser.getFragment();
  editor.selection.insertFragment(fragment);
}

export default (editor: Editor) => {
  editor.container.on('paste', event => {
    event.preventDefault();
    const dataTransfer = (event as ClipboardEvent).clipboardData;
    if (!dataTransfer) {
      return;
    }
    editor.selection.deleteContents();
    const isPlainText = (dataTransfer.types.length === 1);
    if (isPlainText) {
      const content = dataTransfer.getData('text/plain');
      pastePlainText(editor, content);
      return;
    }
    const content = dataTransfer.getData('text/html');
    pasteHTML(editor, content);
  });
};
