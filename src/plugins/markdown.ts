import type Editor from '..';
import { Point } from '../types/object';

const markSpaceRegExp = /(\*\*)[^*]+\*\*$/i;

const boldRegExp = /^\*\*$/;

const headingTypeMap = new Map([
  ['#', 'h1'],
  ['##', 'h2'],
  ['###', 'h3'],
  ['####', 'h4'],
  ['#####', 'h5'],
  ['######', 'h6'],
]);

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

function executeMarkCommand(editor: Editor, point: Point, markdownText: string): void {
  editor.command.event.emit('execute:before');
  if (boldRegExp.test(markdownText)) {
    // console.log(markdownText);
  }
}

function executeBlockCommand(editor: Editor, markdownText: string): void {
  const selection = editor.selection;
  editor.command.event.emit('execute:before');
  selection.removeLeftText();
  const block = selection.getBlocks()[0];
  if (block.html() === '') {
    block.prepend('<br />');
    selection.range.selectAfterNodeContents(block);
  }
  for (const item of blockSpaceList) {
    if (item.re.test(markdownText)) {
      const parameters = item.getParameters(markdownText);
      editor.command.execute(parameters.shift() as string, ...parameters);
    }
  }
}

export default (editor: Editor) => {
  editor.keystroke.setKeyup('space', () => {
    const selection = editor.selection;
    const point = getMarkdownPoint(editor);
    if (!point) {
      return;
    }
    const markdownText = point.node.text().substring(0, point.offset - 1);
    if (markSpaceRegExp.test(markdownText)) {
      executeMarkCommand(editor, point, markdownText);
      return;
    }
    const block = selection.getBlocks()[0];
    if (block && !(block.isHeading || block.name === 'p')) {
      return;
    }
    executeBlockCommand(editor, markdownText);
  });
};
