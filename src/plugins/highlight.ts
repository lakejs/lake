import type { Editor } from '..';
import { toHex } from '../utils/to-hex';

export default (editor: Editor) => {
  if (editor.readonly) {
    return;
  }
  editor.command.add('highlight', {
    selectedValues: activeItems => {
      for (const item of activeItems) {
        if (item.name === 'span') {
          const currentValue = item.node.computedCSS('background-color');
          return [toHex(currentValue)];
        }
      }
      return [];
    },
    execute: (value: string) => {
      editor.selection.addMark(`<span style="background-color: ${value};" />`);
      editor.history.save();
    },
  });
};
