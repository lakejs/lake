import { debug } from '../utils';
import type LakeCore from '../main';

export default () => ({
  name: 'heading',

  initialize: (editor: LakeCore) => {
    editor.command.add('heading', (type: string) => {
      debug('click heading: ', type);
    });
  },
});
