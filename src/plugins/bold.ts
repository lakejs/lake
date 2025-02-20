import type { Editor } from '@/editor';

const tagName = 'strong';

export default (editor: Editor) => {
  if (editor.readonly) {
    return;
  }
  editor.command.add('bold', {
    isDisabled: activeItems => !!activeItems.find(item => item.node.isHeading),
    isSelected: activeItems => !!activeItems.find(item => item.name === tagName),
    execute: () => {
      if (editor.command.isSelected('bold')) {
        editor.selection.removeMark(`<${tagName} />`);
      } else {
        editor.selection.addMark(`<${tagName} />`);
      }
      editor.history.save();
    },
  });
  editor.keystroke.setKeydown('mod+b', event => {
    event.preventDefault();
    editor.command.execute('bold');
  });
};
