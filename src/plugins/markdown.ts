import type Editor from '..';

const markdownRegExp = /^(#+|\d+\.|[*\-+]|\[[\sx]?\]|>)\s$/i;

const headingRegExp = /^#+$/;

const numberedListRegExp = /^\d+\.$/;

const bulletedListRegExp = /^[*\-+]$/;

const checklistFalseRegExp = /^\[\s?\]$/i;

const checklistTrueRegExp = /^\[x\]$/i;

const blockquoteRegExp = /^>$/i;

const headingTypeMap = new Map([
  ['#', 'h1'],
  ['##', 'h2'],
  ['###', 'h3'],
  ['####', 'h4'],
  ['#####', 'h5'],
  ['######', 'h6'],
]);

function removeMarkdownText(editor: Editor) {
  const selection = editor.selection;
  selection.removeLeftText();
  const block = selection.getBlocks()[0];
  if (block.html() === '') {
    block.prepend('<br />');
    selection.range.selectAfterNodeContents(block);
  }
}

export default (editor: Editor) => {
  editor.keystroke.setKeyup('space', event => {
    event.preventDefault();
    const selection = editor.selection;
    const block = selection.getBlocks()[0];
    if (block && !(block.isHeading || block.name === 'p')) {
      return;
    }
    const leftText = selection.getLeftText();
    const result = markdownRegExp.exec(leftText);
    if (result !== null) {
      const markdownText = result[1];
      // Commits unsaved inputted data.
      editor.command.event.emit('execute:before');
      removeMarkdownText(editor);
      if (headingRegExp.test(markdownText)) {
        const type = headingTypeMap.get(markdownText) ?? 'h6';
        editor.command.execute('heading', type);
        return;
      }
      if (numberedListRegExp.test(markdownText)) {
        editor.command.execute('list', 'numbered');
        return;
      }
      if (bulletedListRegExp.test(markdownText)) {
        editor.command.execute('list', 'bulleted');
        return;
      }
      if (checklistFalseRegExp.test(markdownText)) {
        editor.command.execute('list', 'checklist');
        return;
      }
      if (checklistTrueRegExp.test(markdownText)) {
        editor.command.execute('list', 'checklist', true);
        return;
      }
      if (blockquoteRegExp.test(markdownText)) {
        editor.command.execute('blockquote');
      }
    }
  });
};
