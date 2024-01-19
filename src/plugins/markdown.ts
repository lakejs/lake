import type { Editor } from '..';
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
  if (offset < 1) {
    return;
  }
  return {
    node,
    offset,
  };
}

// case 1: <p></p> to <p><br /></p>
// case 2: <p><focus /></p> to <p><br /><focus /></p>
function fixEmptyBlock(block: Nodes): void {
  const newBlock = block.clone(true);
  newBlock.find('lake-bookmark').remove();
  if (newBlock.html() !== '') {
    return;
  }
  block.prepend('<br />');
}

function executeMarkCommand(editor: Editor, point: Point): boolean {
  const selection = editor.selection;
  const range = selection.range;
  const offset = point.offset;
  const text = point.node.text().slice(0, offset);
  for (const item of markSpaceList) {
    const result = item.re.exec(text);
    if (result !== null) {
      // <p>foo**bold**<focus /></p>, offset = 11
      // to
      // <p>foobold\u200B<focus /></p>,
      // to
      // <p>foo[bold]\u200B<focus /></p>, startOffset = 3, endOffset = 7
      editor.prepareOperation();
      const bookmark = selection.insertBookmark();
      const node = bookmark.focus.prev();
      const oldValue = node.text();
      const newValue = `${oldValue.replace(item.re, '$1')}\u200B`;
      node.get(0).nodeValue = newValue;
      range.setStart(node, offset - result[0].length);
      range.setEnd(node, offset - (oldValue.length - newValue.length) - 1);
      const parameters = item.getParameters();
      editor.command.execute(parameters.shift() as string, ...parameters);
      selection.toBookmark(bookmark);
      editor.commitOperation();
      return true;
    }
  }
  return false;
}

function executeBlockCommand(editor: Editor, point: Point): boolean {
  const selection = editor.selection;
  const offset = point.offset;
  let text = point.node.text().slice(0, offset);
  text = text.replace(/[\u200B\u2060]/g, '');
  for (const item of blockSpaceList) {
    if (item.re.test(text)) {
      // <p>#<focus />foo</p>
      // to
      // <h1><focus />foo</h1>
      editor.prepareOperation();
      const bookmark = selection.insertBookmark();
      const node = bookmark.focus.prev();
      node.remove();
      const block = bookmark.focus.closestBlock();
      fixEmptyBlock(block);
      selection.range.shrinkAfter(block);
      const parameters = item.getParameters(text);
      editor.command.execute(parameters.shift() as string, ...parameters);
      selection.toBookmark(bookmark);
      editor.commitOperation();
      return true;
    }
  }
  return false;
}

export default (editor: Editor) => {
  editor.keystroke.setKeydown('space', event => {
    const selection = editor.selection;
    const point = getMarkdownPoint(editor);
    if (!point) {
      return;
    }
    if (executeMarkCommand(editor, point)) {
      event.preventDefault();
      return;
    }
    const block = selection.range.getBlocks()[0];
    if (block && !(block.isHeading || block.name === 'p')) {
      return;
    }
    if (executeBlockCommand(editor, point)) {
      event.preventDefault();
    }
  });
};
