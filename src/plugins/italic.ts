import type Editor from '..';

const tagName = 'i';

export default (editor: Editor) => {
  editor.command.add('italic', () => {
    const appliedNodes = editor.selection.getAppliedNodes();
    if (appliedNodes.find(item => item.name === tagName)) {
      editor.selection.removeMark(`<${tagName} />`);
    } else {
      editor.selection.addMark(`<${tagName} />`);
    }
    editor.history.save();
  });
  editor.keystroke.setKeydown('mod+i', event => {
    event.preventDefault();
    editor.command.execute('italic');
  });
};
