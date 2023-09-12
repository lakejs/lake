import type LakeCore from '../main';

export default (editor: LakeCore) => {
  editor.keystroke.setKeydown('Shift+Enter', event => {
    event.preventDefault();
    editor.selection.insertContents('<br />\u200B');
  });
};
