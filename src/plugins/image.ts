import type { Editor } from '..';
import { BoxValue } from '../types/box';
import { query } from '../utils';
import { Box } from '../models/box';
import { Fragment } from '../models/fragment';

export default (editor: Editor) => {
  editor.setPluginConfig('image', {
    requestMethod: 'POST',
    requestAction: '/upload',
    requestTypes: ['image/gif', 'image/jpeg', 'image/png', 'image/svg+xml'],
  });
  editor.event.on('beforepaste', (nativeFragment: DocumentFragment) => {
    const fragment = new Fragment(nativeFragment);
    fragment.find('img').each(nativeNode => {
      const node = query(nativeNode);
      const box = new Box('image');
      const value = node.attr('data-lake-value');
      if (value === '') {
        box.value = {
          url: node.attr('src'),
          status: 'done',
        };
      } else {
        box.node.attr('value', value);
      }
      node.replaceWith(box.node);
    });
  });
  editor.command.add('image', {
    execute: (value: BoxValue) => {
      editor.insertBox('image', value);
      editor.history.save();
    },
  });
};
