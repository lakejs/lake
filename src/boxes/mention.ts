import { BoxComponent } from '../types/box';
import { query } from '../utils/query';
import { safeTemplate } from '../utils/safe-template';

export default {
  type: 'inline',
  name: 'mention',
  render: box => {
    const editor = box.getEditor();
    const { getProfileUrl } = editor.config.mention;
    const value = box.value;
    const url = getProfileUrl ? getProfileUrl(value) : '#';
    const boxContainer = box.getContainer();
    const rootNode = query(safeTemplate`
      <div class="lake-mention"><a href="${url}">@${value.name}</a></div>
    `);
    boxContainer.empty();
    boxContainer.append(rootNode);
    rootNode.on('click', () => {
      editor.selection.selectBox(box);
    });
    if (!editor.readonly) {
      rootNode.find('a').on('click', (event: Event) => {
        event.preventDefault();
      });
    }
  },
} as BoxComponent;
