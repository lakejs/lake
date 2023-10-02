import type LakeCore from '..';

const tagName = 'u';

export default (editor: LakeCore) => {
  editor.command.add('underline', () => {
    editor.focus();
    const appliedTags = editor.selection.getTags();
    if (appliedTags.find(item => item.name === tagName)) {
      editor.selection.removeMark(`<${tagName} />`);
    } else {
      editor.selection.addMark(`<${tagName} />`);
    }
    editor.history.save();
    editor.select();
  });
  editor.keystroke.setKeydown('mod+u', event => {
    event.preventDefault();
    editor.command.execute('underline');
  });
};
