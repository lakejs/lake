import type { Editor } from '..';
import { query } from '../utils';
import { getBox } from '../utils/get-box';

export default (editor: Editor) => {
  if (editor.readonly) {
    return;
  }
  editor.event.on('cut', (event: ClipboardEvent) => {
    const dataTransfer = event.clipboardData;
    if (!dataTransfer) {
      return;
    }
    const range = editor.selection.range;
    if (range.isInsideBox) {
      return;
    }
    if (!range.isCollapsed) {
      event.preventDefault();
      const fragment = editor.selection.range.cloneContents();
      const tempContainer = query('<div />');
      tempContainer.append(fragment);
      dataTransfer.setData('text/html', tempContainer.html());
      editor.selection.deleteContents();
      editor.history.save();
      return;
    }
    const boxNode = range.commonAncestor.closest('lake-box');
    if (boxNode.length === 0) {
      return;
    }
    if (range.isBoxStart || range.isBoxEnd) {
      return;
    }
    event.preventDefault();
    const box = getBox(boxNode);
    const content = box.getHTML();
    dataTransfer.setData('text/html', content);
    editor.selection.removeBox();
    editor.history.save();
  });
};
