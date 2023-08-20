import { debug } from '../utils';
import type LakeCore from '../main';
import { setBlocks } from '../operations';

export default () => ({
  name: 'heading',

  initialize: (editor: LakeCore) => {
    editor.command.add('heading', (type: string) => {
      editor.focus();
      setBlocks(editor.range, `<${type} />`);
      debug('click heading: ', type);
    });
  },
});
