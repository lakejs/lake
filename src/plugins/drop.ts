import type { Editor } from '..';
import { query } from '../utils/query';
import { Nodes } from '../models/nodes';
import { Box } from '../models/box';
import { uploadImage } from '../ui/upload';

export default (editor: Editor) => {
  if (editor.readonly) {
    return;
  }
  let draggedNode: Nodes | null = null;
  editor.container.on('dragstart', event => {
    draggedNode = null;
    const dragEvent = event as DragEvent;
    const targetNode = query(dragEvent.target as Element);
    const boxNode = targetNode.closest('lake-box');
    if (boxNode.length === 0) {
      return;
    }
    const box = new Box(boxNode);
    if (box.type === 'inline') {
      return;
    }
    const dataTransfer = dragEvent.dataTransfer;
    if (!dataTransfer) {
      return;
    }
    dataTransfer.setData('text/html', boxNode.clone(false).outerHTML());
    draggedNode = boxNode;
  });
  editor.container.on('drop', event => {
    const dragEvent = event as DragEvent;
    const dataTransfer = dragEvent.dataTransfer;
    if (!dataTransfer) {
      return;
    }
    const { requestTypes } = editor.config.image;
    const targetNode = query(dragEvent.target as Element);
    if (targetNode.isContainer) {
      dragEvent.preventDefault();
      return;
    }
    const html = dataTransfer.getData('text/html');
    dataTransfer.clearData('text/html');
    if (draggedNode && html !== '') {
      dragEvent.preventDefault();
      new Box(draggedNode).unmount();
      draggedNode.remove();
      const range = editor.selection.range;
      const targetBoxNode = targetNode.closest('lake-box');
      if (targetBoxNode.length > 0) {
        range.selectBoxEnd(targetBoxNode);
      } else {
        range.selectNodeContents(targetNode);
        range.collapseToEnd();
      }
      const box = new Box(query(html));
      editor.insertBox(box.name, box.value);
      editor.history.save();
      return;
    }
    if (dataTransfer.files.length > 0) {
      dragEvent.preventDefault();
      for (const file of dragEvent.dataTransfer.files) {
        if (requestTypes.indexOf(file.type) >= 0) {
          uploadImage({
            editor,
            file,
          });
        }
      }
    }
  });
};
