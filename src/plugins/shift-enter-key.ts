import type { Editor } from '..';
import { query } from '../utils';

function addBlockForBox(editor: Editor) {
  const range = editor.selection.range;
  const boxNode = range.startNode.closest('lake-box');
  const newBlock = query('<p><br /></p>');
  if (range.isBoxLeft) {
    boxNode.before(newBlock);
  } else if (range.isBoxRight) {
    boxNode.after(newBlock);
    range.shrinkAfter(newBlock);
  } else {
    editor.removeBox();
  }
}

export default (editor: Editor) => {
  editor.keystroke.setKeydown('shift+enter', event => {
    const range = editor.selection.range;
    if (range.isInsideBox) {
      return;
    }
    event.preventDefault();
    if (range.isBox) {
      addBlockForBox(editor);
      editor.history.save();
      return;
    }
    range.adapt();
    if (range.isBox) {
      addBlockForBox(editor);
      editor.history.save();
      return;
    }
    editor.selection.insertContents('<br />\u200B');
    editor.history.save();
  });
};
