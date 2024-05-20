import { BoxComponent } from '../types/box';
import { query } from '../utils';

export const hrBox: BoxComponent = {
  type: 'block',
  name: 'hr',
  render: box => {
    const editor = box.getEditor();
    if (!editor) {
      return;
    }
    const hrNode = query('<div class="lake-hr"><hr /></div>');
    box.getContainer().append(hrNode);
    hrNode.on('click', () => {
      editor.selectBox(box);
    });
  },
  html: () => '<hr />',
};
