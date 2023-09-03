import { debug } from '../utils';
import type LakeCore from '../main';
import { getTags, addMark, removeMark } from '../operations';

const tagName = 'strong';

export default (editor: LakeCore) => {
  editor.commands.add('bold', () => {
    const range = editor.selection.range;
    range.debug();
    const appliedTags = getTags(range);
    if (appliedTags.find(item => item.name === tagName)) {
      removeMark(range, `<${tagName} />`);
    } else {
      addMark(range, `<${tagName} />`);
    }
    editor.select();
    debug('Bold was set.');
  });
};
