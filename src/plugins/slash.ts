import { isKeyHotkey } from 'is-hotkey';
import type { Editor } from '..';
import type { Nodes } from '../models/nodes';
import { SlashPopup } from '../ui/slash-popup';

function getKeyword(block: Nodes): string | null {
  let text = block.text().trim();
  text = text.replace(/[\u200B\u2060]/g, '');
  if (!/^\//.test(text)) {
    return null;
  }
  return text.substring(1);
}

function showPopup(editor: Editor, popup: SlashPopup): void {
  const range = editor.selection.range;
  if (!range.isCollapsed) {
    return;
  }
  const block = range.getBlocks()[0];
  if (!block) {
    return;
  }
  if (block.find('lake-box').length > 0) {
    return;
  }
  const keyword = getKeyword(block);
  if (keyword === null) {
    return;
  }
  const slashRange = range.clone();
  slashRange.selectNodeContents(block);
  popup.show(slashRange, keyword);
}

export default (editor: Editor) => {
  if (editor.readonly) {
    return;
  }
  const popup = new SlashPopup({
    editor,
  });
  editor.root.on('scroll', () => {
    popup.position();
  });
  editor.event.on('resize', () => {
    popup.position();
  });
  let prevKeyword = '';
  editor.container.on('keyup', event => {
    const keyboardEvent = event as KeyboardEvent;
    if (isKeyHotkey('/', keyboardEvent)) {
      showPopup(editor, popup);
      return;
    }
    if (!popup.visible) {
      if (isKeyHotkey('backspace', keyboardEvent)) {
        showPopup(editor, popup);
      } else {
        return;
      }
    }
    const range = editor.selection.range;
    const block = range.getBlocks()[0];
    if (!block) {
      return;
    }
    const keyword = getKeyword(block);
    if (keyword === null) {
      popup.hide();
      return;
    }
    if (keyword === prevKeyword) {
      return;
    }
    const items = popup.search(keyword);
    if (items.length === 0) {
      popup.hide();
      return;
    }
    popup.update(keyword);
    prevKeyword = keyword;
  });
};
