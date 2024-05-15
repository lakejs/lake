import type { Editor } from '..';
import { getBox } from '../utils/get-box';

export default (editor: Editor) => {
  editor.event.on('copy', event => {
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
    const box = getBox(boxNode);
    const content = box.getHTML();
    dataTransfer.setData('text/html', content);
  });
};
