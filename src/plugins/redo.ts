import type LakeCore from '../main';

export default (editor: LakeCore) => {
  editor.commands.add('redo', () => {
    editor.focus();
    editor.history.redo();
    editor.select();
  });
  editor.keystroke.setKeydown('$mod+KeyY', event => {
    event.preventDefault();
    editor.commands.execute('redo');
  });
};
