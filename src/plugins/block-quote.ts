import type { Editor } from '..';
import { safeTemplate } from '../utils';

const typeList = [
  'info',
  'tip',
  'warning',
  'danger',
];

export default (editor: Editor) => {
  if (editor.readonly) {
    return;
  }
  editor.command.add('blockQuote', {
    isSelected: appliedItems => !!appliedItems.find(item => item.name === 'blockquote'),
    execute: (type?: string) => {
      if (type && typeList.indexOf(type) >= 0) {
        editor.selection.setBlocks(safeTemplate`<blockquote type="${type}" />`);
      } else {
        editor.selection.setBlocks('<blockquote />');
      }
      editor.history.save();
    },
  });
};
