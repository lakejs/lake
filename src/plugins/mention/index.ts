import { isKeyHotkey } from 'is-hotkey';
import { request } from 'lakelib/utils/request';
import { Range } from 'lakelib/models/range';
import { Editor } from 'lakelib/editor';
import { MentionMenu } from './mention-menu';
import { MentionItem } from './types';
import mentionBox from './mention-box';

export {
  mentionBox,
};

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
    getProfileUrl: (value: MentionItem) => `/${value.name}`,
  });
  if (editor.readonly) {
    return;
  }
  const { requestAction, requestMethod, items } = editor.config.mention;
  let menu: MentionMenu | null = null;
  const selectListener = (event: Event, item: MentionItem) => {
    if (menu) {
      menu.hide();
    }
    editor.focus();
    const targetRange = editor.selection.range.getCharacterRange('@');
    if (targetRange) {
      targetRange.get().deleteContents();
    }
    editor.selection.insertBox('mention', item);
    editor.history.save();
  };
  const showListener = () => {
    editor.popup = menu;
  };
  const hideListener = () => {
    editor.popup = null;
  };
  const showMenu = () => {
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
              items: body.data,
              onSelect: selectListener,
              onShow: showListener,
              onHide: hideListener,
            });
            menu.show(targetRange, keyword);
          },
          action: requestAction,
          method: requestMethod,
        });
      } else {
        menu = new MentionMenu({
          items,
          onSelect: selectListener,
          onShow: showListener,
          onHide: hideListener,
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
    if (isKeyHotkey(['down', 'up', 'enter'], keyboardEvent)) {
      return;
    }
    if (!menu || !menu.visible) {
      if (keyboardEvent.key === '@') {
        showMenu();
        return;
      }
      if (isKeyHotkey(['backspace', 'delete'], keyboardEvent)) {
        showMenu();
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
