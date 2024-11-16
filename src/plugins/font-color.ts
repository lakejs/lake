import type { Editor } from '..';
import { toHex } from '../utils/to-hex';

export default (editor: Editor) => {
  if (editor.readonly) {
    return;
  }
  editor.command.add('fontColor', {
    selectedValues: activeItems => {
      for (const item of activeItems) {
        if (item.name === 'span') {
          const currentValue = item.node.computedCSS('color');
          return [toHex(currentValue)];
        }
      }
      return [];
    },
    execute: (value: string) => {
      editor.selection.addMark(`<span style="color: ${value};" />`);
      editor.history.save();
    },
  });
};
