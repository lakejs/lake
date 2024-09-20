import { isKeyHotkey } from 'is-hotkey';
import { MentionItem } from '../types/mention';
import type { Editor, Range } from '..';
import { request } from '../utils/request';
import { MentionMenu } from '../ui/mention-menu';

function getKeyword(range: Range): string | null {
  const targetRange = range.getCharacterRange('@');
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
  let menu: MentionMenu | null = null;
  const showPopup = () => {
    const range = editor.selection.range;
    if (!range.isCollapsed) {
      return;
    }
    const targetRange = range.getCharacterRange('@');
    if (targetRange === null) {
      return;
    }
    const keyword = getKeyword(range);
    if (keyword === null) {
      return;
    }
    if (!menu) {
      if (requestAction) {
        request({
          onSuccess: body => {
            if (!body.data) {
              return;
            }
            menu = new MentionMenu({
              editor,
              root: editor.popupContainer,
              items: body.data,
            });
            menu.show(targetRange, keyword);
          },
          action: requestAction,
          method: requestMethod,
        });
      } else {
        menu = new MentionMenu({
          editor,
          root: editor.popupContainer,
          items,
        });
        menu.show(targetRange, keyword);
      }
      return;
    }
    menu.show(targetRange, keyword);
  };
  editor.container.on('keyup', event => {
    if (editor.isComposing) {
      return;
    }
    const keyboardEvent = event as KeyboardEvent;
    if (isKeyHotkey(['down' ,'up', 'enter'], keyboardEvent)) {
      return;
    }
    if (!menu || !menu.visible) {
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
      if (menu) {
        menu.hide();
      }
      return;
    }
    if (menu) {
      menu.update(keyword);
    }
  });
  return () => {
    if (menu) {
      menu.unmount();
    }
  };
};
