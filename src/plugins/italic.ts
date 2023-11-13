import type Editor from '..';

const tagName = 'i';

export default (editor: Editor) => {
  editor.command.add('italic', () => {
    editor.focus();
    const appliedNodes = editor.selection.getAppliedNodes();
    if (appliedNodes.find(item => item.name === tagName)) {
      editor.selection.removeMark(`<${tagName} />`);
    } else {
      editor.selection.addMark(`<${tagName} />`);
    }
    editor.history.save();
    editor.select();
  });
  editor.keystroke.setKeydown('mod+i', event => {
    event.preventDefault();
    editor.command.execute('italic');
  });
};
