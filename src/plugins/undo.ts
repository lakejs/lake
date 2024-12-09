import type { Editor } from 'lakelib/editor';

export default (editor: Editor) => {
  if (editor.readonly) {
    return;
  }
  editor.command.add('undo', {
    isDisabled: () => !editor.history.canUndo,
    execute: () => {
      editor.history.undo();
    },
  });
  editor.keystroke.setKeydown('mod+z', event => {
    const range = editor.selection.range;
    if (range.isInsideBox) {
      return;
    }
    event.preventDefault();
    editor.command.execute('undo');
  });
};
