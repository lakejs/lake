import type { Editor } from 'lakelib/editor';

export default (editor: Editor) => {
  if (editor.readonly) {
    return;
  }
  editor.command.add('selectAll', {
    execute: () => {
      const range = editor.selection.range;
      range.selectNodeContents(editor.container);
      range.shrink();
    },
  });
};
