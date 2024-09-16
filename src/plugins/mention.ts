import { isKeyHotkey } from 'is-hotkey';
import { MentionItem } from '../types/mention';
import type { Editor, Range } from '..';
import { MentionPopup, getTargetRange } from '../ui/mention-popup';

const mentionItems: MentionItem[] = [
  {
    id: '1',
    name: 'luolonghao',
    nickname: 'Roddy',
    avatar: '<img src="../assets/images/universal-studios-240.jpg" />',
  },
  {
    id: '2',
    name: 'heavenlake',
    nickname: 'Heaven Lake',
    avatar: '<img src="../assets/images/heaven-lake-256.png" />',
  },
  {
    id: '3',
    name: 'lacgentau',
    nickname: 'Lac Gentau',
    avatar: '<img src="../assets/images/lac-gentau-256.jpg" />',
  },
  {
    id: '4',
    name: 'universalstudios',
    nickname: 'Universal Studios',
    avatar: '<img src="../assets/images/universal-studios-240.jpg" />',
  },
  {
    id: '5',
    name: 'luolonghao',
    nickname: 'Roddy',
    avatar: '<img src="../assets/images/universal-studios-240.jpg" />',
  },
  {
    id: '6',
    name: 'heavenlake',
    nickname: 'Heaven Lake',
    avatar: '<img src="../assets/images/heaven-lake-256.png" />',
  },
  {
    id: '7',
    name: 'lacgentau',
    nickname: 'Lac Gentau',
    avatar: '<img src="../assets/images/lac-gentau-256.jpg" />',
  },
  {
    id: '8',
    name: 'universalstudios',
    nickname: 'Universal Studios',
    avatar: '<img src="../assets/images/universal-studios-240.jpg" />',
  },
  {
    id: '9',
    name: 'luolonghao',
    nickname: 'Roddy',
    avatar: '<img src="../assets/images/universal-studios-240.jpg" />',
  },
  {
    id: '10',
    name: 'heavenlake',
    nickname: 'Heaven Lake',
    avatar: '<img src="../assets/images/heaven-lake-256.png" />',
  },
  {
    id: '11',
    name: 'lacgentau',
    nickname: 'Lac Gentau',
    avatar: '<img src="../assets/images/lac-gentau-256.jpg" />',
  },
  {
    id: '12',
    name: 'universalstudios',
    nickname: 'Universal Studios',
    avatar: '<img src="../assets/images/universal-studios-240.jpg" />',
  },
];

function getKeyword(range: Range): string | null {
  const targetRange = getTargetRange(range);
  if (targetRange === null) {
    return null;
  }
  let text = targetRange.startNode.text().slice(targetRange.startOffset + 1, targetRange.endOffset);
  text = text.replace(/[\u200B\u2060]/g, '');
  return text;
}

function showPopup(editor: Editor, popup: MentionPopup): void {
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
  popup.show(targetRange, keyword);
}

export default (editor: Editor) => {
  editor.setPluginConfig('mention', {
    items: mentionItems,
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
      if (keyboardEvent.key === '@') {
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
    const keyword = getKeyword(range);
    if (keyword === null) {
      popup.hide();
      return;
    }
    popup.update(keyword);
  });
  return () => popup.unmount();
};
