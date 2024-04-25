import type { Editor } from '..';

export default (editor: Editor) => {
  if (editor.readonly) {
    return;
  }
  editor.keystroke.setKeydown('escape', event => {
    const selection = editor.selection;
    const range = selection.range;
    if (range.isBoxCenter || range.isInsideBox) {
      event.preventDefault();
      const boxNode = range.commonAncestor.closest('lake-box');
      range.selectBoxEnd(boxNode);
      selection.addRangeToNativeSelection();
      return;
    }
    if (editor.root.hasClass('lake-root-focused')) {
      event.preventDefault();
      editor.blur();
    }
  });
};
