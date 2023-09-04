import { debug } from '../utils';
import type LakeCore from '../main';
import { setBlocks } from '../operations';

export default (editor: LakeCore) => {
  editor.commands.add('blockquote', () => {
    editor.focus();
    const range = editor.selection.range;
    setBlocks(range, '<blockquote />');
    editor.select();
    debug('Blockquote was set.');
  });
};
