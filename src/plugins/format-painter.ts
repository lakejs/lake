import type Editor from '..';
import { Nodes } from '../models';

let markList: Nodes[] = [];

const formatPainterClassName = 'lake-format-painter';

export default (editor: Editor) => {
  editor.command.add('formatPainter', () => {
    editor.focus();
    editor.container.addClass(formatPainterClassName);
    const appliedNodes = editor.selection.getAppliedNodes();
    for (const item of appliedNodes) {
      if (item.node.isMark) {
        markList.push(item.node);
      }
    }
  });
  editor.container.on('click', () => {
    for (const mark of markList) {
      editor.selection.addMark(mark);
    }
    markList = [];
    editor.container.removeClass(formatPainterClassName);
  });
  editor.event.on('click:outside', () => {
    editor.container.removeClass(formatPainterClassName);
  });
};
