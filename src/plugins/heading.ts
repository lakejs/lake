import { debug } from '../utils';
import type LakeCore from '../main';
import { setBlocks } from '../operations';

export default (editor: LakeCore) => {
  editor.commands.add('heading', (type: string) => {
    const range = editor.selection.range;
    editor.focus();
    setBlocks(range, `<${type} />`);
    editor.select();
    debug('click heading: ', type);
  });
};
