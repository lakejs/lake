import type LakeCore from '..';
import { adjustStartAttributes } from './list';

export default (editor: LakeCore) => {
  editor.keystroke.setKeydown('enter', event => {
    event.preventDefault();
    const selection = editor.selection;
    let blocks = selection.getBlocks();
    if (blocks.length > 0) {
      selection.splitBlock();
      blocks = selection.getBlocks();
      if (blocks[0] && selection.getRightText() === '') {
        if (blocks[0].isHeading) {
          selection.setBlocks('<p />');
        }
        if (blocks[0].isList && blocks[0].attr('type') === 'checklist') {
          blocks[0].find('li').attr('value', 'false');
        }
      }
      adjustStartAttributes(editor);
    } else {
      selection.setBlocks('<p />');
    }
    editor.history.save();
    editor.select();
  });
};
