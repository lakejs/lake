import type { Editor } from '..';
import { Nodes } from '../models/nodes';

let markList: Nodes[] = [];

const formatPainterClassName = 'lake-format-painter';

export default (editor: Editor) => {
  editor.command.add('formatPainter', () => {
    editor.container.addClass(formatPainterClassName);
    const appliedNodes = editor.selection.getAppliedNodes();
    for (const item of appliedNodes) {
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
  editor.event.on('click', tagetNode => {
    if (tagetNode.isOutside) {
      editor.container.removeClass(formatPainterClassName);
    }
  });
};
