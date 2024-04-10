import type { Editor } from '..';

export default (editor: Editor) => {
  editor.command.add('redo', {
    execute: () => {
      editor.history.redo();
    },
  });
  const redoHandler = (event: Event) => {
    const range = editor.selection.range;
    if (range.isInsideBox) {
      return;
    }
    event.preventDefault();
    editor.command.execute('redo');
  };
  editor.keystroke.setKeydown('mod+y', redoHandler);
  editor.keystroke.setKeydown('mod+shift+z', redoHandler);
};
