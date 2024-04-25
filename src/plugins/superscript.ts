import type { Editor } from '..';

const tagName = 'sup';

export default (editor: Editor) => {
  if (editor.readonly) {
    return;
  }
  editor.command.add('superscript', {
    isSelected: appliedItems => !!appliedItems.find(item => item.name === tagName),
    execute: () => {
      if (editor.command.isSelected('superscript')) {
        editor.selection.removeMark(`<${tagName} />`);
      } else {
        editor.selection.addMark(`<${tagName} />`);
      }
      editor.history.save();
    },
  });
};
