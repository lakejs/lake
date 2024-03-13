import { type Editor } from '..';
import { Nodes } from '../models/nodes';
import { LinkPopup } from '../appearance/link-popup';

export default (editor: Editor) => {
  const popup = new LinkPopup(editor.popupContainer);
  popup.event.on('save', () => {
    popup.hide();
    editor.history.save();
  });
  popup.event.on('remove', () => {
    popup.hide();
    editor.history.save();
  });
  editor.root.on('scroll', () => {
    popup.updatePosition();
  });
  editor.event.on('click', (targetNode: Nodes) => {
    if (targetNode.isOutside) {
      return;
    }
    if (targetNode.closest('lake-box').length > 0) {
      return;
    }
    const linkNode = targetNode.closest('a');
    if (linkNode.length === 0) {
      popup.hide();
      return;
    }
    popup.show(linkNode);
  });
  editor.command.add('link', () => {
    const linkNode = editor.selection.insertLink('<a href="">New link</a>');
    if (!linkNode) {
      return;
    }
    editor.history.save();
    popup.show(linkNode);
  });
};
