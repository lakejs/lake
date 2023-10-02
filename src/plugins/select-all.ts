import type LakeCore from '..';

export default (editor: LakeCore) => {
  editor.command.add('selectAll', () => {
    editor.focus();
    editor.selection.range.selectNodeContents(editor.container);
    editor.history.save();
    editor.select();
  });
  editor.keystroke.setKeydown('mod+a', event => {
    event.preventDefault();
    editor.command.execute('selectAll');
  });
};
