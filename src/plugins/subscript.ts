import type { Editor } from '..';

const tagName = 'sub';

export default (editor: Editor) => {
  if (editor.readonly) {
    return;
  }
  editor.command.add('subscript', {
    isSelected: appliedItems => !!appliedItems.find(item => item.name === tagName),
    execute: () => {
      if (editor.command.isSelected('subscript')) {
        editor.selection.removeMark(`<${tagName} />`);
      } else {
        editor.selection.addMark(`<${tagName} />`);
      }
      editor.history.save();
    },
  });
};
