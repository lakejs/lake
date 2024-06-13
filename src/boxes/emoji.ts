import { BoxComponent } from '../types/box';
import { query, safeTemplate } from '../utils';

export const emojiBox: BoxComponent = {
  type: 'inline',
  name: 'emoji',
  render: box => {
    const editor = box.getEditor();
    if (!editor) {
      return;
    }
    const value = box.value;
    const rootNode = query(safeTemplate`
      <div class="lake-emoji"><img src="${value.url}" title="${value.title}" /></div>
    `);
    box.getContainer().append(rootNode);
    rootNode.on('click', () => {
      editor.selection.selectBox(box);
    });
  },
  html: box => {
    const rawValue = box.node.attr('value');
    return safeTemplate`<img src="${box.value.url}" title="${box.value.title}" data-lake-value="${rawValue}" />`;
  },
};
