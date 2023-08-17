import LakeCore from '../main';

export default function heading() {
  return {
    name: 'heading',

    initialize: (editor: LakeCore) => {
      const { utils, } = editor;
      editor.command.add('heading', (type: string) => {
        utils.debug('run heading: ', type);
      });
    },
  };
}
