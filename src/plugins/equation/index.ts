import { BoxValue } from '@/types/box';
import { Editor } from '@/editor';
import equationBox from './equation-box';

export {
  equationBox,
};

export default (editor: Editor) => {
  if (!window.katex) {
    return;
  }
  editor.setPluginConfig('equation', {
    helpUrl: 'https://katex.org/docs/supported',
  });
  if (editor.readonly) {
    return;
  }
  editor.command.add('equation', {
    execute: (value: BoxValue) => {
      const box = editor.selection.insertBox('equation', value);
      editor.history.save();
      const boxContainer = box.getContainer();
      boxContainer.addClass('lake-box-activated');
      boxContainer.find('textarea').focus();
    },
  });
};
