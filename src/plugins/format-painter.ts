import type Editor from '..';
import { Nodes } from '../models';

let markList: Nodes[] = [];

export default (editor: Editor) => {
  editor.command.add('formatPainter', () => {
    editor.focus();
    editor.container.addClass('lake-format-painter');
    const appliedTags = editor.selection.getTags();
    for (const item of appliedTags) {
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
    editor.container.removeClass('lake-format-painter');
  });
  editor.event.on('click:outside', () => {
    editor.container.removeClass('lake-format-painter');
  });
};
