import type Editor from '..';

export default (editor: Editor) => {
  editor.keystroke.setKeydown('arrow-left', () => {
    const range = editor.selection.range;
    if (!range.isCollapsed) {
      return;
    }
    let prevBlock;
    if (range.startNode.isText && range.startOffset === 0) {
      prevBlock = range.startNode.prev();
    } else {
      prevBlock = range.startNode.children()[range.startOffset - 1];
    }
    if (prevBlock && prevBlock.isBox) {
      range.selectBoxRight(prevBlock);
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
    let nextBlock;
    if (range.startNode.isText && range.startOffset === range.startNode.text().length) {
      nextBlock = range.startNode.next();
    } else {
      nextBlock = range.startNode.children()[range.startOffset];
    }
    if (nextBlock && nextBlock.isBox) {
      range.selectBoxLeft(nextBlock);
    }
    if (range.isBoxRight) {
      const boxNode = range.startNode.closest('lake-box');
      range.setStartAfter(boxNode);
      range.collapseToStart();
    }
  });
};
