import type { Editor } from '..';
import { query } from '../utils/query';
import { Nodes } from '../models/nodes';
import { LinkPopup } from '../appearance/link-popup';

let timeoutId: number | null = null;

// Displays pop-up below the link node
function showPopup(popup: LinkPopup, linkNode?: Nodes): void {
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
    showPopup(popup);
  });
  popup.root.on('mouseleave', () => {
    hidePopup(editor, popup);
  });
}

export default (editor: Editor) => {
  const popup = new LinkPopup(editor.overlayContainer);
  bindPopupEvents(editor, popup);
  editor.command.add('link', () => {
    const range = editor.selection.range;
    if (range.isCollapsed) {
      let linkNode = range.commonAncestor.closest('a');
      if (linkNode.length === 0) {
        linkNode = query('<a href="" target="_blank">New link</a>');
        editor.selection.insertNode(linkNode);
      }
      showPopup(popup, linkNode);
    }
  });
  // Creates an hyperlink from the selection.
  editor.command.add('createLink', (url: string, target: string = '_blank') => {
    const range = editor.selection.range;
    if (range.isCollapsed) {
      const linkNode = range.commonAncestor.closest('a');
      if (linkNode.length === 0) {
        return;
      }
      linkNode.attr({
        href: url,
        target,
      });
      editor.history.save();
      return;
    }
    editor.selection.removeMark('<a />');
    editor.selection.addMark(`<a href="${url}" target="${target}" />`);
    editor.history.save();
  });
  // Removes the link element from a selected hyperlink.
  editor.command.add('unlink', () => {
    const range = editor.selection.range;
    if (range.isCollapsed) {
      const linkNode = range.commonAncestor.closest('a');
      if (linkNode.length === 0) {
        return;
      }
      const bookmark = editor.selection.insertBookmark();
      linkNode.remove(true);
      editor.selection.toBookmark(bookmark);
      editor.history.save();
      return;
    }
    editor.selection.removeMark('<a />');
    editor.history.save();
  });
};
