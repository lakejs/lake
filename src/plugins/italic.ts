import type { Editor } from '..';

const tagName = 'i';

export default (editor: Editor) => {
  editor.command.add('italic', {
    isSelected: appliedItems => !!appliedItems.find(item => item.name === tagName),
    execute: () => {
      if (editor.command.isSelected('italic')) {
        editor.selection.removeMark(`<${tagName} />`);
      } else {
        editor.selection.addMark(`<${tagName} />`);
      }
      editor.history.save();
    },
  });
  editor.keystroke.setKeydown('mod+i', event => {
    event.preventDefault();
    editor.command.execute('italic');
  });
};
