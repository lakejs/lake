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
  editor.setPluginConfig('slash', {
    items: undefined,
  });
  if (editor.readonly) {
    return;
  }
  const popup = new SlashPopup({
    editor,
    items: editor.config.slash.items,
  });
  editor.container.on('keyup', event => {
    if (editor.isComposing) {
      return;
    }
    const keyboardEvent = event as KeyboardEvent;
    if (isKeyHotkey(['down' ,'up', 'enter'], keyboardEvent)) {
      return;
    }
    if (!popup.visible) {
      if (isKeyHotkey('/', keyboardEvent)) {
        showPopup(editor, popup);
        return;
      }
      if (isKeyHotkey(['backspace', 'delete'], keyboardEvent)) {
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
    popup.update(keyword);
  });
  return () => popup.unmount();
};
