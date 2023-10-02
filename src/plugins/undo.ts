import type LakeCore from '..';

export default (editor: LakeCore) => {
  editor.command.add('undo', () => {
    editor.focus();
    editor.history.undo();
    editor.select();
  });
  editor.keystroke.setKeydown('mod+z', event => {
    event.preventDefault();
    editor.command.execute('undo');
  });
};
