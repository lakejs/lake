import { Nodes } from 'lakelib/models/nodes';
import { Editor } from 'lakelib/editor';
import { LinkPopup } from './link-popup';
import { insertLink } from './insert-link';

export default (editor: Editor) => {
  if (editor.readonly) {
    return;
  }
  const popup = new LinkPopup({
    locale: editor.locale,
    onSave: node => {
      const range = editor.selection.range;
      range.setStartAfter(node);
      range.collapseToStart();
      editor.selection.sync();
      editor.history.save();
    },
    onRemove: node => {
      const range = editor.selection.range;
      range.setStartAfter(node);
      range.collapseToStart();
      editor.selection.sync();
      editor.history.save();
    },
    onShow: () => {
      editor.popup = popup;
    },
    onHide: () => {
      editor.popup = null;
    },
  });
  editor.event.on('click', (targetNode: Nodes) => {
    if (popup.container.contains(targetNode)) {
      return;
    }
    if (targetNode.closest('button[name="link"]').length > 0) {
      return;
    }
    const linkNode = targetNode.closest('a');
    if (
      linkNode.length === 0 ||
      !editor.container.contains(linkNode) ||
      linkNode.closest('lake-box').length > 0
    ) {
      if (!popup.visible) {
        return;
      }
      editor.selection.sync();
      popup.hide();
      return;
    }
    popup.show(linkNode);
  });
  editor.command.add('link', {
    execute: () => {
      const range = editor.selection.range;
      const linkNode = insertLink(range, `<a href="">${editor.locale.link.newLink()}</a>`);
      if (!linkNode) {
        return;
      }
      editor.history.save();
      popup.show(linkNode);
    },
  });
  return () => popup.unmount();
};
