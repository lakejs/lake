import type { Editor } from '..';
import { Nodes } from '../models/nodes';

let markList: Nodes[] = [];

const formatPainterClassName = 'lake-format-painter';

export default (editor: Editor) => {
  editor.command.add('formatPainter', () => {
    editor.container.addClass(formatPainterClassName);
    const appliedItems = editor.selection.getAppliedItems();
    for (const item of appliedItems) {
      const node = item.node.clone();
      if (node.isMark && node.name !== 'a') {
        markList.push(node);
      }
    }
  });
  editor.container.on('click', () => {
    for (const mark of markList) {
      editor.selection.addMark(mark);
    }
    editor.history.save();
    markList = [];
    editor.container.removeClass(formatPainterClassName);
  });
  editor.event.on('click', (tagetNode: Nodes) => {
    if (tagetNode.isInside) {
      return;
    }
    const buttonNode = tagetNode.closest('.lake-toolbar-button');
    if (buttonNode.length > 0 && buttonNode.attr('name') === 'formatPainter') {
      return;
    }
    editor.container.removeClass(formatPainterClassName);
  });
};
