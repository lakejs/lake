import type LakeCore from '../main';
import { getTags, addMark, removeMark } from '../operations';

const tagName = 'strong';

export default (editor: LakeCore) => {
  editor.commands.add('bold', () => {
    editor.focus();
    const range = editor.selection.range;
    const appliedTags = getTags(range);
    if (appliedTags.find(item => item.name === tagName)) {
      removeMark(range, `<${tagName} />`);
    } else {
      addMark(range, `<${tagName} />`);
    }
    editor.select();
  });
};
