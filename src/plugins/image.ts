import type { Editor, BoxComponent } from '..';
import { Box } from '../models/box';
import { findNode } from './paste';

export const imageBox: BoxComponent = {
  type: 'inline',
  name: 'image',
  render: box => `<img src="${box.value.url}" />`,
  html: box => `<img src="${box.value.url}" />`,
};

export default (editor: Editor) => {
  editor.event.on('paste:before', (fragment: DocumentFragment) => {
    const nodeList = findNode(fragment, 'img');
    for (const node of nodeList) {
      const box = new Box('image');
      box.value = {
        url: node.attr('src'),
      };
      node.replaceWith(box.node);
    }
  });
  editor.command.add('image', url => {
    editor.selection.insertBox('image', {
      url,
    });
    editor.history.save();
  });
};
