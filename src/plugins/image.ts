import type Editor from '..';
import { BoxDefinition } from '../types/box';

export const imageBox: BoxDefinition = {
  type: 'inline',
  name: 'image',
  render: value => `<img src="${value?.url}" />`,
};

export default (editor: Editor) => {
  editor.command.add('image', url => {
    editor.selection.insertBox('image', {
      url,
    });
    editor.history.save();
  });
};
