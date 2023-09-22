import type LakeCore from '../main';

export default (editor: LakeCore) => {
  editor.keystroke.setKeydown('enter', event => {
    event.preventDefault();
    const selection = editor.selection;
    let blocks = selection.getBlocks();
    if (blocks.length > 0) {
      selection.splitBlock();
      blocks = selection.getBlocks();
      if (blocks[0] && blocks[0].isHeading && selection.getRightText() === '') {
        selection.setBlocks('<p />');
      }
    } else {
      selection.setBlocks('<p />');
    }
    editor.history.save();
    editor.select();
  });
};
