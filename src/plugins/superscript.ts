import type { Editor } from '@/editor';

const tagName = 'sup';

export default (editor: Editor) => {
  if (editor.readonly) {
    return;
  }
  editor.command.add('superscript', {
    isSelected: activeItems => !!activeItems.find(item => item.name === tagName),
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
