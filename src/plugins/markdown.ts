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
    const result = /^(#+)\s$/.exec(leftText);
    if (result) {
      editor.history.save();
      editor.selection.removeLeftText();
      block = selection.getBlocks()[0];
      if (block.html() === '') {
        block.prepend('<br />');
        selection.range.selectAfterNodeContents(block);
      }
      const type = headingTypeMap.get(result[1]) ?? 'h6';
      editor.command.execute('heading', type);
    }
  });
};
