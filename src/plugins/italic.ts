import type { Editor } from '@/editor';

const tagName = 'i';

export default (editor: Editor) => {
  if (editor.readonly) {
    return;
  }
  editor.command.add('italic', {
    isSelected: activeItems => !!activeItems.find(item => item.name === tagName),
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
