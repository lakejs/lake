import type { Editor } from '..';

const tagName = 'u';

export default (editor: Editor) => {
  if (editor.readonly) {
    return;
  }
  editor.command.add('underline', {
    isSelected: appliedItems => !!appliedItems.find(item => item.name === tagName),
    execute: () => {
      if (editor.command.isSelected('underline')) {
        editor.selection.removeMark(`<${tagName} />`);
      } else {
        editor.selection.addMark(`<${tagName} />`);
      }
      editor.history.save();
    },
  });
  editor.keystroke.setKeydown('mod+u', event => {
    event.preventDefault();
    editor.command.execute('underline');
  });
};
