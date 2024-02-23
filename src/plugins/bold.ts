import type { Editor } from '..';

const tagName = 'strong';

export default (editor: Editor) => {
  editor.command.add('bold', () => {
    const appliedItems = editor.selection.getAppliedItems();
    if (appliedItems.find(item => item.name === tagName)) {
      editor.selection.removeMark(`<${tagName} />`);
    } else {
      editor.selection.addMark(`<${tagName} />`);
    }
    editor.history.save();
  });
  editor.keystroke.setKeydown('mod+b', event => {
    event.preventDefault();
    editor.command.execute('bold');
  });
};
