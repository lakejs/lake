import type { Editor } from 'lakelib/editor';
import { template } from '../utils/template';

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
    isSelected: activeItems => !!activeItems.find(item => item.name === 'blockquote'),
    execute: (type?: string) => {
      if (type && typeList.indexOf(type) >= 0) {
        editor.selection.setBlocks(template`<blockquote type="${type}" />`);
      } else {
        editor.selection.setBlocks('<blockquote />');
      }
      editor.history.save();
    },
  });
};
