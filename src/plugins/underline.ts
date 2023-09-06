import type LakeCore from '../main';
import { getTags, addMark, removeMark } from '../operations';

export default (editor: LakeCore) => {
  editor.commands.add('underline', () => {
    editor.focus();
    const range = editor.selection.range;
    const appliedTags = getTags(range);
    if (appliedTags.find(item => item.name === 'span')) {
      removeMark(range, '<span style="text-decoration: underline;" />');
    } else {
      addMark(range, '<span style="text-decoration: underline;" />');
    }
    editor.select();
  });
};
