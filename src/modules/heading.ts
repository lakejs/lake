import LakeCore from '../main';

export default () => ({
  name: 'heading',

  initialize: (editor: LakeCore) => {
    editor.command.add('heading', (type: string) => {
      editor.utils.debug('run heading: ', type);
    });
  },
});
