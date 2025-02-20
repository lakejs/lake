import type { Editor } from '@/editor';

export default (editor: Editor) => {
  if (editor.readonly) {
    return;
  }
  editor.command.add('redo', {
    isDisabled: () => !editor.history.canRedo,
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
