import { type Editor } from '..';
import { Nodes } from '../models/nodes';
import { LinkPopup } from '../ui/link-popup';
import { locale } from '../i18n';

export default (editor: Editor) => {
  const popup = new LinkPopup(editor.popupContainer);
  popup.event.on('save', node => {
    const range = editor.selection.range;
    range.setStartAfter(node);
    range.collapseToStart();
    editor.selection.addRangeToNativeSelection();
    editor.history.save();
  });
  popup.event.on('remove', node => {
    const range = editor.selection.range;
    range.setStartAfter(node);
    range.collapseToStart();
    editor.selection.addRangeToNativeSelection();
    editor.history.save();
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
    if (
      linkNode.isOutside ||
      linkNode.closest('lake-box').length > 0
    ) {
      return;
    }
    popup.show(linkNode);
  });
  editor.container.on('click', event => {
    const targetNode = new Nodes(event.target as Element);
    if (targetNode.closest('a').length > 0) {
      event.preventDefault();
    }
  });
  editor.command.add('link', {
    execute: () => {
      const linkNode = editor.selection.insertLink(`<a href="">${locale.link.newLink()}</a>`);
      if (!linkNode) {
        return;
      }
      editor.history.save();
      popup.show(linkNode);
    },
  });
};
