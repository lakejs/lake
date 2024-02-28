import type { BoxComponent } from '..';
import { safeTemplate } from '../utils/safe-template';

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
    return safeTemplate`<img src="${box.value.url}" />`;
  },
  html: box => safeTemplate`<img src="${box.value.url}" />`,
};
