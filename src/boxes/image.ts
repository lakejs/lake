import type { BoxComponent } from '..';

export const imageBox: BoxComponent = {
  type: 'inline',
  name: 'image',
  render: box => {
    const editor = box.getEditor();
    if (!editor) {
      return;
    }
    box.useEffect(() => {
      box.getContainer().on('click', () => {
        editor.selection.range.selectBox(box.node);
      });
      return () => box.getContainer().off('click');
    });
    return `<img src="${box.value.url}" />`;
  },
  html: box => `<img src="${box.value.url}" />`,
};
