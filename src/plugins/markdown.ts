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
    const leftText = selection.getLeftText();
    const result = /^(#{1,6}) $/.exec(leftText);
    if (result) {
      editor.history.save();
      const type = headingTypeMap.get(result[1]) ?? 'h1';
      editor.command.execute('heading', type);
    }
  });
};
