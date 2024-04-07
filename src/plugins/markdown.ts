import type { Editor } from '..';
import { Point } from '../types/object';
import { Nodes } from '../models/nodes';

type MarkItem = {
  re: RegExp;
  getParameters: () => string[];
};

type BlockItem = {
  re: RegExp;
  getParameters: () => (string | boolean)[];
} | {
  re: RegExp;
  getParameters: (results: RegExpExecArray) => (string | boolean | object)[];
};

const headingTypeMap = new Map([
  ['#', 'h1'],
  ['##', 'h2'],
  ['###', 'h3'],
  ['####', 'h4'],
  ['#####', 'h5'],
  ['######', 'h6'],
]);

const markItemList: MarkItem[] = [
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

const blockItemListForSpaceKey: BlockItem[] = [
  {
    re: /^#+$/,
    getParameters: (results: RegExpExecArray) => [
      'heading',
      headingTypeMap.get(results[0]) ?? 'h6',
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
      'blockQuote',
    ],
  },
];

const blockItemListForEnterKey: BlockItem[] = [
  {
    re: /^-+$/,
    getParameters: () => [
      'hr',
    ],
  },
  {
    re: /^`+([a-z]*)$/i,
    getParameters: (results: RegExpExecArray) => {
      if (!results[1]) {
        return [
          'codeBlock',
        ];
      }
      return [
        'codeBlock',
        {
          lang: results[1],
        },
      ];
    },
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
  for (const item of markItemList) {
    const results = item.re.exec(text);
    if (results !== null) {
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
      range.setStart(node, offset - results[0].length);
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

function spaceKeyExecutesBlockCommand(editor: Editor, point: Point): boolean {
  const selection = editor.selection;
  const offset = point.offset;
  let text = point.node.text().slice(0, offset);
  text = text.replace(/[\u200B\u2060]/g, '');
  for (const item of blockItemListForSpaceKey) {
    const results = item.re.exec(text);
    if (results !== null) {
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
      const parameters = item.getParameters(results);
      editor.command.execute(parameters.shift() as string, ...parameters);
      selection.toBookmark(bookmark);
      editor.commitOperation();
      return true;
    }
  }
  return false;
}

function enterKeyExecutesBlockCommand(editor: Editor, block: Nodes): boolean {
  const selection = editor.selection;
  let text = block.text();
  text = text.replace(/[\u200B\u2060]/g, '');
  for (const item of blockItemListForEnterKey) {
    const results = item.re.exec(text);
    if (results !== null) {
      // <p>---<focus /></p>
      // to
      // <lake-box type="block" name="hr" focus="right"></lake-box>
      editor.prepareOperation();
      block.empty();
      fixEmptyBlock(block);
      selection.range.shrinkAfter(block);
      const parameters = item.getParameters(results);
      editor.command.execute(parameters.shift() as string, ...parameters);
      editor.commitOperation();
      return true;
    }
  }
  return false;
}

export default (editor: Editor) => {
  editor.keystroke.setKeydown('space', event => {
    const selection = editor.selection;
    const range = selection.range;
    if (range.isBox) {
      return;
    }
    const point = getMarkdownPoint(editor);
    if (!point) {
      return;
    }
    if (executeMarkCommand(editor, point)) {
      event.preventDefault();
      return;
    }
    const block = range.getBlocks()[0];
    if (!block) {
      return;
    }
    if (!(block.isHeading || block.name === 'p')) {
      return;
    }
    if (spaceKeyExecutesBlockCommand(editor, point)) {
      event.preventDefault();
    }
  });
  editor.keystroke.setKeydown('enter', event => {
    const selection = editor.selection;
    const range = selection.range;
    if (range.isBox) {
      return;
    }
    const block = range.getBlocks()[0];
    if (!block) {
      return;
    }
    if (!(block.isHeading || block.name === 'p')) {
      return;
    }
    if (block.find('lake-box').length > 0) {
      return;
    }
    if (range.getRightText() !== '') {
      return;
    }
    if (enterKeyExecutesBlockCommand(editor, block)) {
      event.preventDefault();
      event.stopImmediatePropagation();
      // returning false is for unit test
      return false;
    }
  });
};
