import type { Editor, BoxComponent } from '..';
import { Box } from '../models/box';
import { findNode } from './paste';

export const hrBox: BoxComponent = {
  type: 'block',
  name: 'hr',
  render: () => '<hr />',
  html: () => '<hr />',
};

export default (editor: Editor) => {
  editor.event.on('paste:before', (fragment: DocumentFragment) => {
    const nodeList = findNode(fragment, 'hr');
    for (const node of nodeList) {
      const box = new Box('hr');
      node.replaceWith(box.node);
    }
  });
  editor.command.add('hr', () => {
    editor.selection.insertBox('hr');
    editor.history.save();
  });
};
