import type { Editor } from 'lakelib/editor';

const tagName = 'u';

export default (editor: Editor) => {
  if (editor.readonly) {
    return;
  }
  editor.command.add('underline', {
    isSelected: activeItems => !!activeItems.find(item => item.name === tagName),
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
