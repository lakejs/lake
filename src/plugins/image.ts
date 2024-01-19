import type { Editor, BoxComponent } from '..';

export const imageBox: BoxComponent = {
  type: 'inline',
  name: 'image',
  render: box => `<img src="${box?.value.url}" />`,
};

export default (editor: Editor) => {
  editor.command.add('image', url => {
    editor.selection.insertBox('image', {
      url,
    });
    editor.history.save();
  });
};
