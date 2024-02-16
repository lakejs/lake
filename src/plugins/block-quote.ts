import type { Editor } from '..';

export default (editor: Editor) => {
  editor.command.add('blockQuote', () => {
    editor.selection.setBlocks('<blockquote />');
    editor.history.save();
  });
};
