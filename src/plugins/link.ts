import { type Editor } from '..';
import { Nodes } from '../models/nodes';
import { LinkPopup } from '../ui/link-popup';

export default (editor: Editor) => {
  let popup: LinkPopup;
  const showPopup = (lineNode: Nodes): void => {
    if (popup) {
      popup.show(lineNode);
      return;
    }
    popup = new LinkPopup(editor.popupContainer);
    popup.event.on('save', () => {
      editor.history.save();
    });
    popup.event.on('remove', () => {
      editor.history.save();
    });
    popup.show(lineNode);
  };
  editor.root.on('scroll', () => {
    if (!popup) {
      return;
    }
    popup.updatePosition();
  });
  editor.event.on('resize', () => {
    if (!popup) {
      return;
    }
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
      if (popup) {
        popup.hide();
      }
      return;
    }
    showPopup(linkNode);
  });
  editor.command.add('link', () => {
    const linkNode = editor.selection.insertLink('<a href="">New link</a>');
    if (!linkNode) {
      return;
    }
    editor.history.save();
    showPopup(linkNode);
  });
};
