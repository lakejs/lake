import type { Editor } from '..';

export default (editor: Editor) => {
  editor.command.add('redo', () => {
    editor.history.redo();
  });
  editor.keystroke.setKeydown('mod+y', event => {
    const range = editor.selection.range;
    if (range.isInsideBox) {
      return;
    }
    event.preventDefault();
    editor.command.execute('redo');
  });
};
