import { debug } from '../utils';
import type LakeCore from '../main';
import { setBlocks } from '../operations';

export default (editor: LakeCore) => {
  editor.commands.add('blockquote', () => {
    const range = editor.selection.range;
    editor.focus();
    setBlocks(range, '<blockquote />');
    editor.select();
    debug('Blockquote was set.');
  });
};
