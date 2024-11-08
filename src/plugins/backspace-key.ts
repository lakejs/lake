import type { Editor } from '..';
import { getBox, appendBreak, mergeNodes, setBlockIndent } from '../utils';
import { Nodes } from '../models/nodes';
import { Range } from '../models/range';
import { setBlocks } from '../operations/set-blocks';

function emptyBlock(range: Range): void {
  const block = range.getBlocks()[0];
  if (block && block.isEmpty && block.first().name !== 'br') {
    block.empty();
    const breakNode = appendBreak(block);
    range.setStartBefore(breakNode);
    range.collapseToStart();
  }
}

function mergeWithPreviousBlock(editor: Editor, block: Nodes): void {
  const range = editor.selection.range;
  let prevBlock = block.prev();
  if (prevBlock.length === 0) {
    if (block.name !== 'p') {
      editor.selection.setBlocks('<p />');
    }
    return;
  }
  if (prevBlock.isBox) {
    if (block.isEmpty) {
      block.remove();
    }
    range.selectBoxEnd(prevBlock);
    return;
  }
  if (prevBlock.name ===  'br') {
    prevBlock.remove();
    return;
  }
  if (!prevBlock.isBlock) {
    const prevRange = new Range();
    prevRange.selectNodeContents(prevBlock);
    setBlocks(prevRange, '<p />');
    prevBlock = prevRange.startNode.closestBlock();
  }
  if (prevBlock.isEmpty) {
    prevBlock.remove();
    return;
  }
  emptyBlock(range);
  const nextNode = range.getNextNode();
  if (nextNode.name === 'br' && prevBlock.name !== 'p') {
    nextNode.remove();
    range.shrinkAfter(prevBlock);
    return;
  }
  const bookmark = editor.selection.insertBookmark();
  mergeNodes(prevBlock, block);
  editor.selection.toBookmark(bookmark);
  editor.selection.fixList();
}

export default (editor: Editor) => {
  if (editor.readonly) {
    return;
  }
  editor.keystroke.setKeydown('backspace', event => {
    const range = editor.selection.range;
    if (range.isInsideBox) {
      const boxNode = range.commonAncestor.closest('lake-box');
      const box = getBox(boxNode);
      const boxValue = box.value;
      if (
        range.isCollapsed && box.name === 'codeBlock' &&
        (boxValue.code === undefined || boxValue.code === '')
      ) {
        event.preventDefault();
        editor.selection.removeBox(box);
        editor.history.save();
      }
      return;
    }
    editor.fixContent();
    if (range.isBoxStart) {
      const boxNode = range.startNode.closest('lake-box');
      const prevNode = boxNode.prev();
      if (prevNode.length === 0) {
        const block = boxNode.closestBlock();
        if (block.length > 0 && !block.isContainer) {
          event.preventDefault();
          mergeWithPreviousBlock(editor, block);
          editor.history.save();
        }
        return;
      }
      if (prevNode.isBlock) {
        if (prevNode.isEmpty) {
          event.preventDefault();
          prevNode.remove();
          editor.selection.fixList();
          editor.history.save();
          return;
        }
        event.preventDefault();
        range.shrinkAfter(prevNode);
        return;
      }
      if (prevNode.isText && prevNode.text().length === 1) {
        event.preventDefault();
        prevNode.remove();
        editor.history.save();
        return;
      }
      range.adjustBox();
    }
    if (range.isBox) {
      event.preventDefault();
      editor.selection.removeBox();
      editor.history.save();
      return;
    }
    if (!range.isCollapsed) {
      event.preventDefault();
      editor.selection.deleteContents();
      if (editor.container.html().trim() === '') {
        editor.setValue('<p><br /><focus /></p>');
      }
      editor.history.save();
      return;
    }
    range.adjust();
    const prevNode = range.getPrevNode();
    if (prevNode.isBox) {
      event.preventDefault();
      editor.selection.removeBox(prevNode);
      editor.history.save();
      return;
    }
    if ((prevNode.isMark || prevNode.name === 'a') && prevNode.isEmpty) {
      event.preventDefault();
      prevNode.remove();
      editor.history.save();
      return;
    }
    if (prevNode.isText && prevNode.text().length === 1 && prevNode.parent().isBlock) {
      event.preventDefault();
      const block = prevNode.closestBlock();
      range.setStartBefore(prevNode);
      range.collapseToStart();
      prevNode.remove();
      if (block.isEmpty) {
        const breakNode = appendBreak(block);
        range.setStartBefore(breakNode);
        range.collapseToStart();
      }
      editor.history.save();
      return;
    }
    const nextNode = range.getNextNode();
    if (prevNode.name === 'br' && nextNode.length > 0) {
      event.preventDefault();
      range.setStartBefore(prevNode);
      range.collapseToStart();
      prevNode.remove();
      editor.history.save();
      return;
    }
    const startText = range.getStartText();
    if (startText === '') {
      event.preventDefault();
      let block = range.getBlocks()[0];
      if (!block) {
        editor.selection.setBlocks('<p />');
        block = range.getBlocks()[0];
      }
      if(
        block.css('margin-left') !== '' ||
        block.css('text-indent') !== '' ||
        block.attr('indent') !== ''
      ) {
        setBlockIndent(block, 'decrease');
        editor.history.save();
        return;
      }
      if (block.isList || block.name === 'blockquote') {
        editor.selection.setBlocks('<p />');
        editor.history.save();
        return;
      }
      mergeWithPreviousBlock(editor, block);
      editor.history.save();
    }
  });
};
