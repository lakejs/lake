import type { Editor } from '..';
import { mergeNodes, setBlockIndent } from '../utils';
import { Nodes } from '../models/nodes';
import { Range } from '../models/range';
import { setBlocks } from '../operations/set-blocks';
import { removeBox } from '../operations/remove-box';

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
    range.selectBoxRight(prevBlock);
    return;
  }
  if (!prevBlock.isBlock) {
    const prevRange = new Range();
    prevRange.selectNodeContents(prevBlock);
    setBlocks(prevRange, '<p />');
    prevBlock = prevBlock.closestBlock();
  }
  if (prevBlock.isEmpty) {
    prevBlock.remove();
    return;
  }
  const bookmark = editor.selection.insertBookmark();
  mergeNodes(prevBlock, block);
  editor.selection.toBookmark(bookmark);
  editor.selection.fixList();
}

export default (editor: Editor) => {
  editor.keystroke.setKeydown('backspace', event => {
    const range = editor.selection.range;
    if (range.isInsideBox) {
      return;
    }
    if (range.isBoxLeft) {
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
      range.adaptBox();
      return;
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
    range.adapt();
    const prevNode = range.getPrevNode();
    if (prevNode.isBox) {
      event.preventDefault();
      range.selectBoxRight(prevNode);
      removeBox(range);
      editor.history.save();
      return;
    }
    const leftText = range.getLeftText();
    if (leftText === '') {
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
