import { debug } from '../utils';
import type LakeCore from '../main';
import { setBlocks } from '../operations';

export default (editor: LakeCore) => {
  editor.command.add('heading', (type: string) => {
    editor.focus();
    setBlocks(editor.range, `<${type} />`);
    debug('click heading: ', type);
  });
};
