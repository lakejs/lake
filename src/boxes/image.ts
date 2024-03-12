import type { BoxComponent } from '..';
import { query } from '../utils';
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
    const root = query('<div />');
    const container = box.getContainer();
    container.empty();
    container.append(root);
    root.html(box.value.status);
    root.append(safeTemplate`<img src="${box.value.url}" />`);
  },
  html: box => {
    const value = box.value;
    return safeTemplate`<img src="${value.url}" />`;
  },
};
