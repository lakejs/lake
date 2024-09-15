import { isKeyHotkey } from 'is-hotkey';
import { MentionItem } from '../types/mention';
import type { Editor, Range } from '..';
import { MentionPopup } from '../ui/mention-popup';

function getKeyword(range: Range): string | null {
  // TODO
  let text = range.startNode.text().slice(-1);
  text = text.replace(/[\u200B\u2060]/g, '');
  if (!/^\//.test(text)) {
    return null;
  }
  return text.substring(1);
}

function showPopup(editor: Editor, popup: MentionPopup): void {
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
  const keyword = getKeyword(range);
  if (keyword === null) {
    return;
  }
  const slashRange = range.clone();
  slashRange.selectNodeContents(block);
  popup.show(slashRange, keyword);
}

export default (editor: Editor) => {
  editor.setPluginConfig('mention', {
    items: [{
      id: '1',
      name: 'luolonghao',
      nickname: 'Roddy',
      avatar: '<img src="../assets/images/universal-studios-240.jpg" />',
    }],
    getUrl:  (value: MentionItem) => `/${value.name}`,
  });
  if (editor.readonly) {
    return;
  }
  const popup = new MentionPopup({
    editor,
    items: editor.config.mention.items,
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
      if (isKeyHotkey('@', keyboardEvent)) {
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
    const keyword = getKeyword(range);
    if (keyword === null) {
      popup.hide();
      return;
    }
    popup.update(keyword);
  });
  return () => popup.unmount();
};
