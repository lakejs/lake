import type { BoxComponent } from '..';
import { template } from '../utils/template';

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
    return template`<img src="${box.value.url}" />`;
  },
  html: box => template`<img src="${box.value.url}" />`,
};
