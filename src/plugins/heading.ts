import { debug } from '../utils';
import type LakeCore from '../main';
import { setBlocks } from '../operations';

export default (editor: LakeCore) => {
  editor.commands.add('heading', (type: string) => {
    editor.focus();
    const range = editor.selection.range;
    setBlocks(range, `<${type} />`);
    editor.select();
    debug(`Heading '${type}' was set.`);
  });
};
