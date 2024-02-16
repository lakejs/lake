import type { BoxComponent } from '..';

export const hrBox: BoxComponent = {
  type: 'block',
  name: 'hr',
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
    return '<hr />';
  },
  html: () => '<hr />',
};
