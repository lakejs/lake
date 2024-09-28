import { isKeyHotkey } from 'is-hotkey';
import type { Editor } from '..';
import type { Nodes } from '../models/nodes';
import { SlashMenu } from '../ui/slash-menu';

const defaultItems: string[] = [
  'heading1',
  'heading2',
  'heading3',
  'heading4',
  'heading5',
  'heading6',
  'paragraph',
  'blockQuote',
  'numberedList',
  'bulletedList',
  'checklist',
  'hr',
];

function getKeyword(block: Nodes): string | null {
  let text = block.text().trim();
  text = text.replace(/[\u200B\u2060]/g, '');
  if (!/^\//.test(text)) {
    return null;
  }
  return text.substring(1);
}

export default (editor: Editor) => {
  editor.setPluginConfig('slash', {
    items: defaultItems,
  });
  if (editor.readonly) {
    return;
  }
  const menu = new SlashMenu({
    editor,
    items: editor.config.slash.items,
  });
  const showMenu = () => {
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
    editor.popup = menu;
    menu.show(slashRange, keyword);
  };
  editor.container.on('keyup', event => {
    if (editor.isComposing) {
      return;
    }
    const keyboardEvent = event as KeyboardEvent;
    if (isKeyHotkey(['down' ,'up', 'enter'], keyboardEvent)) {
      return;
    }
    if (!menu.visible) {
      if (isKeyHotkey('/', keyboardEvent)) {
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
    const block = range.getBlocks()[0];
    if (!block) {
      return;
    }
    const keyword = getKeyword(block);
    if (keyword === null) {
      menu.hide();
      return;
    }
    menu.update(keyword);
  });
  return () => {
    menu.unmount();
    editor.popup = null;
  };
};
