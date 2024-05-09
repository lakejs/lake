import type { Editor } from '..';
import { Box } from '../models/box';

export default (editor: Editor) => {
  if (editor.readonly) {
    return;
  }
  editor.event.on('cut', event => {
    const range = editor.selection.range;
    if (range.isInsideBox) {
      return;
    }
    const boxNode = range.startNode.closest('lake-box');
    if (boxNode.length === 0) {
      return;
    }
    if (range.isBoxStart || range.isBoxEnd) {
      return;
    }
    event.preventDefault();
    const dataTransfer = (event as ClipboardEvent).clipboardData;
    if (!dataTransfer) {
      return;
    }
    const box = new Box(boxNode);
    const content = box.getHTML();
    dataTransfer.setData('text/html', content);
    editor.removeBox();
    editor.history.save();
  });
};
