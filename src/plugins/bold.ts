import { debug } from '../utils';
import type LakeCore from '../main';
import { addMark } from '../operations';

export default (editor: LakeCore) => {
  editor.commands.add('bold', () => {
    const range = editor.selection.range;
    editor.focus();
    addMark(range, '<strong />');
    editor.select();
    debug('Bold was set.');
  });
};
