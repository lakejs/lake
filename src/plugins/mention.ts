import { isKeyHotkey } from 'is-hotkey';
import { MentionItem } from '../types/mention';
import type { Editor, Range } from '..';
import { request } from '../utils/request';
import { MentionPopup, getTargetRange } from '../ui/mention-popup';

function getKeyword(range: Range): string | null {
  const targetRange = getTargetRange(range);
  if (targetRange === null) {
    return null;
  }
  let text = targetRange.startNode.text().slice(targetRange.startOffset + 1, targetRange.endOffset);
  text = text.replace(/[\u200B\u2060]/g, '');
  return text;
}

export default (editor: Editor) => {
  editor.setPluginConfig('mention', {
    requestMethod: 'GET',
    items: [],
    getProfileUrl:  (value: MentionItem) => `/${value.name}`,
  });
  if (editor.readonly) {
    return;
  }
  const { requestAction, requestMethod, items } = editor.config.mention;
  let popup: MentionPopup | null = null;
  const showPopup = () => {
    const range = editor.selection.range;
    if (!range.isCollapsed) {
      return;
    }
    const targetRange = getTargetRange(range);
    if (targetRange === null) {
      return;
    }
    const keyword = getKeyword(range);
    if (keyword === null) {
      return;
    }
    if (!popup) {
      if (requestAction) {
        request({
          onSuccess: body => {
            if (!body.data) {
              return;
            }
            popup = new MentionPopup({
              editor,
              items: body.data,
            });
            popup.show(targetRange, keyword);
          },
          action: requestAction,
          method: requestMethod,
        });
      } else {
        popup = new MentionPopup({
          editor,
          items,
        });
        popup.show(targetRange, keyword);
      }
      return;
    }
    popup.show(targetRange, keyword);
  };
  editor.container.on('keyup', event => {
    if (editor.isComposing) {
      return;
    }
    const keyboardEvent = event as KeyboardEvent;
    if (isKeyHotkey(['down' ,'up', 'enter'], keyboardEvent)) {
      return;
    }
    if (!popup || !popup.visible) {
      if (keyboardEvent.key === '@') {
        showPopup();
        return;
      }
      if (isKeyHotkey(['backspace', 'delete'], keyboardEvent)) {
        showPopup();
      } else {
        return;
      }
    }
    const range = editor.selection.range;
    const keyword = getKeyword(range);
    if (keyword === null) {
      if (popup) {
        popup.hide();
      }
      return;
    }
    if (popup) {
      popup.update(keyword);
    }
  });
  return () => {
    if (popup) {
      popup.unmount();
    }
  };
};
