import type { Editor } from '..';

const tagName = 's';

export default (editor: Editor) => {
  if (editor.readonly) {
    return;
  }
  editor.command.add('strikethrough', {
    isSelected: activeItems => !!activeItems.find(item => item.name === tagName),
    execute: () => {
      if (editor.command.isSelected('strikethrough')) {
        editor.selection.removeMark(`<${tagName} />`);
      } else {
        editor.selection.addMark(`<${tagName} />`);
      }
      editor.history.save();
    },
  });
  editor.keystroke.setKeydown('mod+shift+x', event => {
    event.preventDefault();
    editor.command.execute('strikethrough');
  });
};
