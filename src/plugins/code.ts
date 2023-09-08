import type LakeCore from '../main';

const tagName = 'code';

export default (editor: LakeCore) => {
  editor.commands.add('code', () => {
    editor.focus();
    const appliedTags = editor.selection.getTags();
    if (appliedTags.find(item => item.name === tagName)) {
      editor.selection.removeMark(`<${tagName} />`);
    } else {
      editor.selection.addMark(`<${tagName} />`);
    }
    editor.select();
  });
};
