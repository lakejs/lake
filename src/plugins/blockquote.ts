import type { Editor } from '..';

export default (editor: Editor) => {
  editor.command.add('blockquote', () => {
    editor.selection.setBlocks('<blockquote />');
    editor.history.save();
  });
};
