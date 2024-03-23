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
      const root = box.getContainer().find('.lake-hr');
      root.on('click', () => {
        editor.selection.range.selectBox(box.node);
      });
    });
    return '<div class="lake-hr"><hr /></div>';
  },
  html: () => '<hr />',
};
