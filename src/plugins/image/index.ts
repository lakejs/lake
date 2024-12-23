import { BoxValue } from 'lakelib/types/box';
import { query } from 'lakelib/utils/query';
import { getBox } from 'lakelib/utils/get-box';
import { Fragment } from 'lakelib/models/fragment';
import { Editor } from 'lakelib/editor';
import imageBox from './image-box';

export {
  imageBox,
};

export default (editor: Editor) => {
  editor.setPluginConfig('image', {
    requestMethod: 'POST',
    requestTypes: ['image/gif', 'image/jpeg', 'image/png', 'image/svg+xml'],
  });
  if (editor.readonly) {
    return;
  }
  editor.event.on('beforepaste', (nativeFragment: DocumentFragment) => {
    const fragment = new Fragment(nativeFragment);
    fragment.find('img').each(nativeNode => {
      const node = query(nativeNode);
      const box = getBox('image');
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
      editor.selection.insertBox('image', value);
      editor.history.save();
    },
  });
};
