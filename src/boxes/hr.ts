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
    const rootNode = query('<div class="lake-hr"><hr /></div>');
    box.getContainer().append(rootNode);
    rootNode.on('click', () => {
      editor.selection.selectBox(box);
    });
  },
  html: () => '<hr />',
};
