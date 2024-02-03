import type { Editor } from '..';
import { Box } from '../models/box';

export default (editor: Editor) => {
  editor.container.on('copy', event => {
    const range = editor.selection.range;
    if (range.isInsideBox) {
      return;
    }
    const boxNode = range.startNode.closest('lake-box');
    if (boxNode.length === 0) {
      return;
    }
    if (range.isBoxLeft || range.isBoxRight) {
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
  });
};
