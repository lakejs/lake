import type { Editor } from '..';
import { toHex } from '../utils';

export default (editor: Editor) => {
  editor.command.add('fontColor', {
    selectedValues: appliedItems => {
      for (const item of appliedItems) {
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
