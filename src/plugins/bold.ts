import type LakeCore from '../main';

const tagName = 'strong';

export default (editor: LakeCore) => {
  editor.commands.add('bold', () => {
    editor.focus();
    const appliedTags = editor.selection.getTags();
    if (appliedTags.find(item => item.name === tagName)) {
      editor.selection.removeMark(`<${tagName} />`);
    } else {
      editor.selection.addMark(`<${tagName} />`);
    }
    editor.select();
  });
  editor.keystroke.setKeydown('$mod+KeyB', event => {
    event.preventDefault();
    editor.commands.execute('bold');
  });
};
