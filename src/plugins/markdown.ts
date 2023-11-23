import type Editor from '..';
import { Point } from '../types/object';
import { Nodes } from '../models/nodes';

const headingTypeMap = new Map([
  ['#', 'h1'],
  ['##', 'h2'],
  ['###', 'h3'],
  ['####', 'h4'],
  ['#####', 'h5'],
  ['######', 'h6'],
]);

const markSpaceList = [
  {
    re: /\*\*(.+?)\*\*$/,
    getParameters: () => [
      'bold',
    ],
  },
  {
    re: /__(.+?)__$/,
    getParameters: () => [
      'bold',
    ],
  },
  {
    re: /_(.+?)_$/,
    getParameters: () => [
      'italic',
    ],
  },
  {
    re: /\*(.+?)\*$/,
    getParameters: () => [
      'italic',
    ],
  },
  {
    re: /==(.+?)==$/,
    getParameters: () => [
      'highlight',
      '#fff566', // yellow-4, from https://ant.design/docs/spec/colors
    ],
  },
  {
    re: /~~(.+?)~~$/,
    getParameters: () => [
      'strikethrough',
    ],
  },
  {
    re: /`(.+?)`$/,
    getParameters: () => [
      'code',
    ],
  },
];

const blockSpaceList = [
  {
    re: /^#+$/,
    getParameters: (text: string) => [
      'heading',
      headingTypeMap.get(text) ?? 'h6',
    ],
  },
  {
    re: /^\d+\.$/,
    getParameters: () => [
      'list',
      'numbered',
    ],
  },
  {
    re: /^[*\-+]$/,
    getParameters: () => [
      'list',
      'bulleted',
    ],
  },
  {
    re: /^\[\s?\]$/,
    getParameters: () => [
      'list',
      'checklist',
      false,
    ],
  },
  {
    re: /^\[x\]$/i,
    getParameters: () => [
      'list',
      'checklist',
      true,
    ],
  },
  {
    re: /^>$/,
    getParameters: () => [
      'blockquote',
    ],
  },
];

function getMarkdownPoint(editor: Editor): Point | void {
  const selection = editor.selection;
  const range = selection.range;
  let node = range.startNode;
  let offset = range.startOffset;
  if (offset === 0) {
    return;
  }
  if (node.isElement) {
    const child = node.children()[offset - 1];
    if (!child || !child.isText) {
      return;
    }
    node = child;
    offset = node.text().length;
  }
  if (offset < 2) {
    return;
  }
  return {
    node,
    offset,
  };
}

function fixEmptyBlock(block: Nodes): void {
  if (block.text() !== '') {
    return;
  }
  if (block.find('br').length > 0) {
    return;
  }
  if (block.children().length > 1 || !block.first().isBookmark) {
    return;
  }
  block.prepend('<br />');
}

function executeMarkCommand(editor: Editor, point: Point): boolean {
  const selection = editor.selection;
  const range = selection.range;
  const offset = point.offset;
  const text = point.node.text().slice(0, offset - 1);
  for (const item of markSpaceList) {
    const result = item.re.exec(text);
    if (result !== null) {
      editor.command.event.emit('execute:before');
      const bookmark = selection.insertBookmark();
      const node = bookmark.focus.prev();
      const oldValue = node.text();
      const newValue = `${oldValue.slice(0, -1).replace(item.re, '$1')}\u200B`;
      node.get(0).nodeValue = newValue;
      range.setStart(node, offset - result[0].length - 1);
      range.setEnd(node, offset - (oldValue.length - newValue.length) - 1);
      editor.history.pause();
      const parameters = item.getParameters();
      editor.command.execute(parameters.shift() as string, ...parameters);
      selection.toBookmark(bookmark);
      editor.history.continue();
      editor.history.save();
      return true;
    }
  }
  return false;
}

function executeBlockCommand(editor: Editor, point: Point): boolean {
  const selection = editor.selection;
  const offset = point.offset;
  let text = point.node.text().slice(0, offset - 1);
  text = text.replace(/[\u200B\u2060]/g, '');
  for (const item of blockSpaceList) {
    if (item.re.test(text)) {
      editor.command.event.emit('execute:before');
      const bookmark = selection.insertBookmark();
      const node = bookmark.focus.prev();
      node.remove();
      const block = bookmark.focus.closestBlock();
      fixEmptyBlock(block);
      selection.range.selectAfterNodeContents(block);
      editor.history.pause();
      const parameters = item.getParameters(text);
      editor.command.execute(parameters.shift() as string, ...parameters);
      selection.toBookmark(bookmark);
      editor.history.continue();
      editor.history.save();
      return true;
    }
  }
  return false;
}

export default (editor: Editor) => {
  editor.keystroke.setKeyup('space', () => {
    const selection = editor.selection;
    const point = getMarkdownPoint(editor);
    if (!point) {
      return;
    }
    const isMatched = executeMarkCommand(editor, point);
    if (isMatched) {
      return;
    }
    const block = selection.getBlocks()[0];
    if (block && !(block.isHeading || block.name === 'p')) {
      return;
    }
    executeBlockCommand(editor, point);
  });
};
