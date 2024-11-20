import { type Editor } from '..';
import { query } from '../utils/query';
import { Nodes } from '../models/nodes';
import { Range } from '../models/range';
import { insertContents } from '../operations/insert-contents';
import { splitMarks } from '../operations/split-marks';
import { insertBookmark } from '../operations/insert-bookmark';
import { toBookmark } from '../operations/to-bookmark';
import { LinkPopup } from '../ui/link-popup';

// Inserts a link element into the specified range.
export function insertLink(range: Range, value: string | Nodes): Nodes | null {
  if (range.commonAncestor.isOutside) {
    return null;
  }
  const valueNode = query(value);
  if (range.isCollapsed) {
    let linkNode = range.commonAncestor.closest('a');
    if (linkNode.length === 0) {
      linkNode = valueNode.clone(true);
      insertContents(range, linkNode);
      return linkNode;
    }
    const url = valueNode.attr('href');
    if (url !== '') {
      linkNode.attr({
        href: valueNode.attr('href'),
      });
    }
    return linkNode;
  }
  splitMarks(range);
  const bookmark = insertBookmark(range);
  for (const child of range.commonAncestor.getWalker()) {
    if (child.name === 'a' && range.intersectsNode(child)) {
      child.remove(true);
    }
  }
  const linkNode = valueNode.clone(false);
  bookmark.anchor.after(linkNode);
  let node = linkNode.next();
  while(node.length > 0) {
    const nextNode = node.next();
    if (!node.isMark && !node.isText) {
      break;
    }
    linkNode.append(node);
    node = nextNode;
  }
  if (linkNode.first().length === 0) {
    linkNode.remove();
  }
  toBookmark(range, bookmark);
  return linkNode;
}

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
