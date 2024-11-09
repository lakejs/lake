import { BoxComponent } from '../types/box';
import { query } from '../utils/query';
import { template } from '../utils/template';

export default {
  type: 'inline',
  name: 'emoji',
  render: box => {
    const editor = box.getEditor();
    const value = box.value;
    const boxContainer = box.getContainer();
    const rootNode = query(template`
      <div class="lake-emoji"><img src="${value.url}" title="${value.title}" /></div>
    `);
    boxContainer.empty();
    boxContainer.append(rootNode);
    rootNode.on('click', () => {
      editor.selection.selectBox(box);
    });
  },
} as BoxComponent;
