import { BoxComponent } from '../types/box';
import { query } from '../utils/query';

export const hrBox: BoxComponent = {
  type: 'block',
  name: 'hr',
  render: box => {
    const editor = box.getEditor();
    if (!editor) {
      return;
    }
    const boxContainer = box.getContainer();
    const rootNode = query('<div class="lake-hr"><hr /></div>');
    boxContainer.empty();
    boxContainer.append(rootNode);
    rootNode.on('click', () => {
      editor.selection.selectBox(box);
    });
  },
  html: () => '<hr />',
};
