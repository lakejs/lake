import type LakeCore from '../main';

export default (editor: LakeCore) => {
  editor.commands.add('undo', () => {
    editor.focus();
    editor.history.undo();
    editor.select();
  });
  editor.keystroke.setKeydown('$mod+KeyZ', event => {
    event.preventDefault();
    editor.commands.execute('undo');
  });
};
