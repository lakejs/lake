import type Editor from '..';

export default (editor: Editor) => {
  editor.command.add('selectAll', () => {
    const range = editor.selection.range;
    range.selectNodeContents(editor.container);
    range.shrink();
  });
};
