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
      const hrNode = box.getContainer().find('.lake-hr');
      hrNode.on('click', () => {
        editor.selectBox(box);
      });
    });
    return '<div class="lake-hr"><hr /></div>';
  },
  html: () => '<hr />',
};
