import type LakeCore from '../main';

export default (editor: LakeCore) => {
  editor.commands.add('selectAll', () => {
    editor.focus();
    editor.selection.range.selectNodeContents(editor.container);
    editor.history.save();
    editor.select();
  });
  editor.keystroke.setKeydown('mod+a', event => {
    event.preventDefault();
    editor.commands.execute('selectAll');
  });
};
