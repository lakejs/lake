import { BoxComponent } from '../types/box';
import { query } from '../utils/query';
import { safeTemplate } from '../utils/safe-template';

export const emojiBox: BoxComponent = {
  type: 'inline',
  name: 'emoji',
  render: box => {
    const editor = box.getEditor();
    if (!editor) {
      return;
    }
    const value = box.value;
    const boxContainer = box.getContainer();
    const rootNode = query(safeTemplate`
      <div class="lake-emoji"><img src="${value.url}" title="${value.title}" /></div>
    `);
    boxContainer.empty();
    boxContainer.append(rootNode);
    rootNode.on('click', () => {
      editor.selection.selectBox(box);
    });
  },
};
