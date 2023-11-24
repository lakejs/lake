import type Editor from '..';
import { Nodes } from '../models/nodes';

export function setBlockIndent(block: Nodes, type: 'increase' | 'decrease'): void {
  let value = Number.parseInt(block.css('margin-left'), 10) || 0;
  if (type === 'decrease' && value === 0 && block.css('text-indent') !== '') {
    block.css('text-indent', '');
    return;
  }
  if (type === 'increase') {
    value += 40;
  } else {
    value -= 40;
  }
  if (value <= 0) {
    value = 0;
  }
  if (value === 0) {
    block.css('margin-left', '');
  } else {
    block.css('margin-left', `${value}px`);
  }
}

export default (editor: Editor) => {
  editor.command.add('indent', (type: 'increase' | 'decrease') => {
    editor.focus();
    const blocks = editor.selection.range.getBlocks();
    for (const block of blocks) {
      setBlockIndent(block, type);
    }
    editor.history.save();
    editor.select();
  });
};
