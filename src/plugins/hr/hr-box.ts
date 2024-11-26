import './hr-box.css';
import { BoxComponent } from 'lakelib/types/box';
import { query } from 'lakelib/utils/query';

export default {
  type: 'block',
  name: 'hr',
  render: box => {
    const editor = box.getEditor();
    const boxContainer = box.getContainer();
    const rootNode = query('<div class="lake-hr"><hr /></div>');
    boxContainer.empty();
    boxContainer.append(rootNode);
    rootNode.on('click', () => {
      editor.selection.selectBox(box);
    });
  },
  html: () => '<hr />',
} as BoxComponent;
