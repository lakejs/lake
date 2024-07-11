import { type Editor } from '..';
import { Nodes } from '../models/nodes';
import { LinkPopup } from '../ui/link-popup';

export default (editor: Editor) => {
  if (editor.readonly) {
    return;
  }
  const popup = new LinkPopup({
    root: editor.popupContainer,
    locale: editor.locale,
    onSave: node => {
      const range = editor.selection.range;
      range.setStartAfter(node);
      range.collapseToStart();
      editor.history.save();
    },
    onRemove: node => {
      const range = editor.selection.range;
      range.setStartAfter(node);
      range.collapseToStart();
      editor.history.save();
    },
  });
  editor.root.on('scroll', () => {
    popup.updatePosition();
  });
  editor.event.on('resize', () => {
    popup.updatePosition();
  });
  editor.event.on('click', (targetNode: Nodes) => {
    if (targetNode.closest('button[name="link"]').length > 0) {
      return;
    }
    const linkNode = targetNode.closest('a');
    if (linkNode.length === 0) {
      popup.hide();
      return;
    }
    if (!editor.container.contains(linkNode) || linkNode.closest('lake-box').length > 0) {
      popup.hide();
      return;
    }
    popup.show(linkNode);
  });
  editor.command.add('link', {
    execute: () => {
      const linkNode = editor.selection.insertLink(`<a href="">${editor.locale.link.newLink()}</a>`);
      if (!linkNode) {
        return;
      }
      editor.history.save();
      popup.show(linkNode);
    },
  });
};
