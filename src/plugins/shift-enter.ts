import type LakeCore from '../main';

export default (editor: LakeCore) => {
  editor.keystroke.setKeydown('shift+enter', event => {
    event.preventDefault();
    editor.selection.insertContents('<br />\u200B');
    editor.history.save();
    editor.select();
  });
};
