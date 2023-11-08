import type Editor from '..';

const headingTypeMap = new Map([
  ['#', 'h1'],
  ['##', 'h2'],
  ['###', 'h3'],
  ['####', 'h4'],
  ['#####', 'h5'],
  ['######', 'h6'],
]);

export default (editor: Editor) => {
  editor.keystroke.setKeyup('space', event => {
    event.preventDefault();
    const selection = editor.selection;
    let block = selection.getBlocks()[0];
    if (block && !(block.isHeading || block.name === 'p')) {
      return;
    }
    const leftText = selection.getLeftText();
    const result = /^(#+|\d+\.|[*\-+]|\[[\sx]?\]|>)\s$/i.exec(leftText);
    if (result) {
      editor.command.event.emit('execute:before');
      editor.selection.removeLeftText();
      block = selection.getBlocks()[0];
      if (block.html() === '') {
        block.prepend('<br />');
        selection.range.selectAfterNodeContents(block);
      }
      if (/^#+$/.test(result[1])) {
        const type = headingTypeMap.get(result[1]) ?? 'h6';
        editor.command.execute('heading', type);
        return;
      }
      if (/^\d+\.$/.test(result[1])) {
        editor.command.execute('list', 'numbered');
        return;
      }
      if (/^[*\-+]$/.test(result[1])) {
        editor.command.execute('list', 'bulleted');
        return;
      }
      if (/^\[\s?\]$/i.test(result[1])) {
        editor.command.execute('list', 'checklist');
        return;
      }
      if (/^\[x\]$/i.test(result[1])) {
        editor.command.execute('list', 'checklist', true);
        return;
      }
      if (/^>$/i.test(result[1])) {
        editor.command.execute('blockquote');
      }
    }
  });
};
