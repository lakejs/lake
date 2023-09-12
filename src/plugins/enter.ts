import type LakeCore from '../main';

export default (editor: LakeCore) => {
  editor.keystroke.setKeydown('Enter', event => {
    event.preventDefault();
    const blockList = editor.selection.getBlocks();
    if (blockList.length > 0) {
      editor.selection.splitBlock();
    } else {
      editor.selection.setBlocks('<p />');
    }
  });
};
