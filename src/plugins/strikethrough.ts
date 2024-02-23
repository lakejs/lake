import type { Editor } from '..';

const tagName = 's';

export default (editor: Editor) => {
  editor.command.add('strikethrough', () => {
    const appliedItems = editor.selection.getAppliedItems();
    if (appliedItems.find(item => item.name === tagName)) {
      editor.selection.removeMark(`<${tagName} />`);
    } else {
      editor.selection.addMark(`<${tagName} />`);
    }
    editor.history.save();
  });
  editor.keystroke.setKeydown('mod+shift+x', event => {
    event.preventDefault();
    editor.command.execute('strikethrough');
  });
};
