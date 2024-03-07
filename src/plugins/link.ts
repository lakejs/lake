import { type Editor } from '..';
import { Nodes } from '../models/nodes';
import { LinkPopup } from '../appearance/link-popup';

let hideTimeoutId: number | null = null;
let showTimeoutId: number | null = null;
let hasNewLink = false;

// Clear all timers
function clearTimers(): void {
  if (hideTimeoutId) {
    window.clearTimeout(hideTimeoutId);
    hideTimeoutId = null;
  }
  if (showTimeoutId) {
    window.clearTimeout(showTimeoutId);
    showTimeoutId = null;
  }
}

// Displays pop-up below the link node with delay
function showPopup(popup: LinkPopup, linkNode: Nodes): void {
  clearTimers();
  showTimeoutId = window.setTimeout(() => {
    popup.show(linkNode);
    hasNewLink = false;
  }, 300);
}

// Hides pop-up with delay
function hidePopup(editor: Editor, popup: LinkPopup): void {
  clearTimers();
  hideTimeoutId = window.setTimeout(() => {
    popup.hide();
    editor.history.save();
  }, 300);
}

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
    if (targetNode.closest('a').length > 0) {
      return;
    }
    popup.hide();
    editor.history.save();
  });
  editor.event.on('mouseover', (targetNode: Nodes) => {
    if (targetNode.isOutside) {
      return;
    }
    const linkNode = targetNode.closest('a');
    if (linkNode.length === 0) {
      if (hasNewLink) {
        return;
      }
      hidePopup(editor, popup);
      return;
    }
    showPopup(popup, linkNode);
  });
  popup.root.on('mouseenter', () => {
    clearTimers();
    hasNewLink = false;
  });
  popup.root.on('mouseleave', () => {
    hidePopup(editor, popup);
  });
  editor.command.add('link', () => {
    const linkNode = editor.selection.insertLink('<a href="">New link</a>');
    if (!linkNode) {
      return;
    }
    editor.history.save();
    clearTimers();
    popup.show(linkNode);
    hasNewLink = true;
  });
};
