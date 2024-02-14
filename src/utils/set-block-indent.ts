import type { Nodes } from '../models/nodes';
import { fixNumberedList } from './fix-numbered-list';

export function setBlockIndent(block: Nodes, type: 'increase' | 'decrease'): void {
  if (block.isList) {
    let indent = Number.parseInt(block.attr('indent'), 10) || 0;
    if (type === 'increase') {
      indent++;
    } else {
      indent--;
    }
    if (indent <= 0) {
      indent = 0;
    } else if (indent > 10) {
      return;
    }
    if (indent === 0) {
      block.removeAttr('indent');
    } else {
      block.attr('indent', indent.toString(10));
    }
    fixNumberedList([ block ]);
    return;
  }
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
