import type { Editor } from 'lakelib/editor';
import { getBox } from 'lakelib/utils/get-box';

export default (editor: Editor) => {
  editor.event.on('copy', event => {
    const range = editor.selection.range;
    if (range.isInsideBox) {
      return;
    }
    if (!range.isCollapsed) {
      range.adjust();
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
    const dataTransfer = (event as ClipboardEvent).clipboardData;
    if (!dataTransfer) {
      return;
    }
    const box = getBox(boxNode);
    const content = box.getHTML();
    dataTransfer.setData('text/html', content);
  });
};
