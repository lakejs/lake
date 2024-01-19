import type { Editor } from '..';

export default (editor: Editor) => {
  editor.keystroke.setKeydown('arrow-left', event => {
    const range = editor.selection.range;
    if (range.isBoxCenter) {
      return;
    }
    const boxNode = range.commonAncestor.closest('lake-box');
    if (boxNode.length > 0) {
      if (range.isBoxLeft) {
        range.setStartBefore(boxNode);
        range.collapseToStart();
      } else if (range.isBoxRight) {
        event.preventDefault();
        range.selectBox(boxNode);
      } else {
        event.preventDefault();
        range.selectBoxLeft(boxNode);
      }
      return;
    }
    if (!range.isCollapsed) {
      return;
    }
    const prevNode = range.getPrevNode();
    if (prevNode.isBox) {
      event.preventDefault();
      range.selectBox(prevNode);
    }
  });
  editor.keystroke.setKeydown('arrow-right', event => {
    const range = editor.selection.range;
    if (range.isBoxCenter) {
      return;
    }
    const boxNode = range.commonAncestor.closest('lake-box');
    if (boxNode.length > 0) {
      if (range.isBoxLeft) {
        event.preventDefault();
        range.selectBox(boxNode);
      } else if (range.isBoxRight) {
        range.setStartAfter(boxNode);
        range.collapseToStart();
      } else {
        event.preventDefault();
        range.selectBoxRight(boxNode);
      }
      return;
    }
    if (!range.isCollapsed) {
      return;
    }
    const nextNode = range.getNextNode();
    if (nextNode.isBox) {
      event.preventDefault();
      range.selectBox(nextNode);
    }
  });
  editor.keystroke.setKeydown('arrow-up', () => {
    const range = editor.selection.range;
    if (range.isBoxCenter) {
      return;
    }
    const boxNode = range.commonAncestor.closest('lake-box');
    if (boxNode.length > 0) {
      range.setStartBefore(boxNode);
      range.collapseToStart();
    }
  });
  editor.keystroke.setKeydown('arrow-down', () => {
    const range = editor.selection.range;
    if (range.isBoxCenter) {
      return;
    }
    const boxNode = range.commonAncestor.closest('lake-box');
    if (boxNode.length > 0) {
      range.setStartAfter(boxNode);
      range.collapseToStart();
    }
  });
};
