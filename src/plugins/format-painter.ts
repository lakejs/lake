import type { Editor } from '..';
import { Nodes } from '../models/nodes';

let markList: Nodes[] = [];

const formatPainterClassName = 'lake-format-painter';

export default (editor: Editor) => {
  editor.command.add('formatPainter', {
    execute: () => {
      editor.container.addClass(formatPainterClassName);
      const appliedItems = editor.selection.getAppliedItems();
      for (const item of appliedItems) {
        const node = item.node.clone();
        if (node.isMark && node.name !== 'a') {
          markList.push(node);
        }
      }
    },
  });
  editor.container.on('click', () => {
    editor.container.removeClass(formatPainterClassName);
    if (markList.length === 0) {
      return;
    }
    for (const mark of markList) {
      editor.selection.addMark(mark);
    }
    markList = [];
    editor.history.save();
  });
  editor.event.on('click', (tagetNode: Nodes) => {
    if (tagetNode.isInside) {
      return;
    }
    const buttonNode = tagetNode.closest('button[name="formatPainter"]');
    if (buttonNode.length > 0) {
      return;
    }
    editor.container.removeClass(formatPainterClassName);
    markList = [];
  });
};
