import type Editor from '..';

export default (editor: Editor) => {
  editor.keystroke.setKeydown('arrow-left', () => {
    const range = editor.selection.range;
    if (!range.isCollapsed) {
      return;
    }
    const prevNode = range.getPrevNode();
    if (prevNode.isBox) {
      range.selectBoxRight(prevNode);
      return;
    }
    if (range.isBoxLeft) {
      const boxNode = range.startNode.closest('lake-box');
      range.setStartBefore(boxNode);
      range.collapseToStart();
    }
  });
  editor.keystroke.setKeydown('arrow-right', () => {
    const range = editor.selection.range;
    if (!range.isCollapsed) {
      return;
    }
    const nextNode = range.getNextNode();
    if (nextNode.isBox) {
      range.selectBoxLeft(nextNode);
      return;
    }
    if (range.isBoxRight) {
      const boxNode = range.startNode.closest('lake-box');
      range.setStartAfter(boxNode);
      range.collapseToStart();
    }
  });
};
