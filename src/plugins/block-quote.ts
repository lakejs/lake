import type { Editor } from '..';

export default (editor: Editor) => {
  editor.command.add('blockQuote', {
    isSelected: appliedItems => !!appliedItems.find(item => item.name === 'blockquote'),
    execute: () => {
      editor.selection.setBlocks('<blockquote />');
      editor.history.save();
    },
  });
};
