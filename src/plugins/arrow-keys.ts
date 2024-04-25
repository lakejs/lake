import type { Editor } from '..';

export default (editor: Editor) => {
  if (editor.readonly) {
    return;
  }
  editor.keystroke.setKeydown('arrow-left', event => {
    const range = editor.selection.range;
    if (range.isInsideBox) {
      return;
    }
    const boxNode = range.commonAncestor.closest('lake-box');
    if (boxNode.length > 0) {
      if (range.isBoxStart) {
        const prevNode = boxNode.prev();
        if (prevNode.isBlock || prevNode.isBox) {
          event.preventDefault();
          if (prevNode.isInlineBox) {
            range.selectBox(prevNode);
            return;
          }
          range.shrinkAfter(prevNode);
          return;
        }
        range.setStartBefore(boxNode);
        range.collapseToStart();
        return;
      }
      if (range.isBoxEnd) {
        event.preventDefault();
        range.selectBox(boxNode);
        return;
      }
      event.preventDefault();
      range.selectBoxStart(boxNode);
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
    if (range.isInsideBox) {
      return;
    }
    const boxNode = range.commonAncestor.closest('lake-box');
    if (boxNode.length > 0) {
      if (range.isBoxStart) {
        event.preventDefault();
        range.selectBox(boxNode);
        return;
      }
      if (range.isBoxEnd) {
        const nextNode = boxNode.next();
        if (nextNode.isBlock || nextNode.isBox) {
          event.preventDefault();
          if (nextNode.isInlineBox) {
            range.selectBox(nextNode);
            return;
          }
          range.shrinkBefore(nextNode);
          return;
        }
        range.setStartAfter(boxNode);
        range.collapseToStart();
        return;
      }
      event.preventDefault();
      range.selectBoxEnd(boxNode);
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
  editor.keystroke.setKeydown('arrow-up', event => {
    const range = editor.selection.range;
    if (range.isInsideBox) {
      return;
    }
    const boxNode = range.commonAncestor.closest('lake-box');
    if (boxNode.length > 0) {
      if (boxNode.isBlockBox) {
        const prevNode = boxNode.prev();
        if (prevNode.isBlock || prevNode.isBox) {
          event.preventDefault();
          range.shrinkAfter(prevNode);
          return;
        }
      }
      range.setStartBefore(boxNode);
      range.collapseToStart();
    }
  });
  editor.keystroke.setKeydown('arrow-down', event => {
    const range = editor.selection.range;
    if (range.isInsideBox) {
      return;
    }
    const boxNode = range.commonAncestor.closest('lake-box');
    if (boxNode.length > 0) {
      if (boxNode.isBlockBox) {
        const nextNode = boxNode.next();
        if (nextNode.isBlock || nextNode.isBox) {
          event.preventDefault();
          range.shrinkBefore(nextNode);
          return;
        }
      }
      range.setStartAfter(boxNode);
      range.collapseToStart();
    }
  });
};
