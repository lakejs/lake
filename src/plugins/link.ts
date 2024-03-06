import { type Editor } from '..';
import { Nodes } from '../models/nodes';
import { LinkPopup } from '../appearance/link-popup';

let timeoutId: number | null = null;

// Displays pop-up below the link node
function showPopup(popup: LinkPopup, linkNode: Nodes): void {
  if (timeoutId) {
    window.clearTimeout(timeoutId);
    timeoutId = null;
  }
  popup.show(linkNode);
}

// Hides pop-up
function hidePopup(editor: Editor, popup: LinkPopup): void {
  if (timeoutId) {
    window.clearTimeout(timeoutId);
  }
  timeoutId = window.setTimeout(() => {
    popup.hide();
    editor.history.save();
  }, 300);
}

// Binds events for pop-up
function bindPopupEvents(editor: Editor, popup: LinkPopup): void {
  editor.event.on('mouseover', (targetNode: Nodes) => {
    if (targetNode.isOutside) {
      return;
    }
    if (targetNode.closest('.lake-link-popup').length > 0) {
      return;
    }
    const linkNode = targetNode.closest('a');
    if (linkNode.length === 0) {
      hidePopup(editor, popup);
      return;
    }
    showPopup(popup, linkNode);
  });
  popup.root.on('mouseenter', () => {
    if (timeoutId) {
      window.clearTimeout(timeoutId);
      timeoutId = null;
    }
  });
  popup.root.on('mouseleave', () => {
    hidePopup(editor, popup);
  });
}

export default (editor: Editor) => {
  const popup = new LinkPopup({
    target: editor.overlayContainer,
    onRemove: () => {
      popup.hide();
      editor.history.save();
    },
  });
  bindPopupEvents(editor, popup);
  editor.command.add('link', () => {
    const linkNode = editor.selection.insertLink('<a href="">New link</a>');
    if (!linkNode) {
      return;
    }
    editor.history.save();
    showPopup(popup, linkNode);
  });
};
