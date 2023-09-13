import type LakeCore from '../main';

export default (editor: LakeCore) => {
  editor.keystroke.setKeydown('Enter', event => {
    event.preventDefault();
    const selection = editor.selection;
    const blockList = selection.getBlocks();
    if (blockList.length > 0) {
      selection.splitBlock();
      if (selection.getRightText() === '') {
        selection.setBlocks('<p />');
      }
    } else {
      selection.setBlocks('<p />');
    }
  });
};
