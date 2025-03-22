import { isKeyHotkey } from 'is-hotkey';
import { appendBreak } from '@/utils/append-break';
import { uploadFile } from '@/utils/upload-file';
import { Nodes } from '@/models/nodes';
import { Editor } from '@/editor';
import { SlashMenu } from './slash-menu';

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
  'table',
  'infoAlert',
  'tipAlert',
  'warningAlert',
  'dangerAlert',
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

function emptyBlock(editor: Editor): void {
  const range = editor.selection.range;
  const block = range.commonAncestor.closestBlock();
  block.empty();
  appendBreak(block);
  range.shrinkBefore(block);
}

export default (editor: Editor) => {
  editor.setPluginConfig('slash', {
    items: defaultItems,
  });
  if (editor.readonly) {
    return;
  }
  const menu = new SlashMenu({
    locale: editor.locale,
    items: editor.config.slash.items,
    onSelect: (event, item, fileNode) => {
      if (menu) {
        menu.hide();
      }
      editor.focus();
      emptyBlock(editor);
      if (item.type === 'upload') {
        if (!fileNode) {
          return;
        }
        const target = event.target as HTMLInputElement;
        const fileNativeNode = fileNode.get(0) as HTMLInputElement;
        const files = target.files || [];
        for (const file of files) {
          uploadFile({
            editor,
            pluginName: item.name,
            file,
            onError: error => {
              fileNativeNode.value = '';
              editor.config.onMessage('error', error);
            },
            onSuccess: () => {
              fileNativeNode.value = '';
            },
          });
        }
      } else {
        item.onClick(editor, item.name);
      }
    },
    onShow: () => {
      editor.popup = menu;
    },
    onHide: () => {
      editor.popup = null;
    },
  });
  const showMenu = () => {
    const range = editor.selection.range;
    if (!range.isCollapsed) {
      return;
    }
    const block = range.getBlocks()[0];
    if (
      !block
      || block.find('lake-box').length > 0
      || block.closest('table').length > 0
    ) {
      return;
    }
    const keyword = getKeyword(block);
    if (keyword === null) {
      return;
    }
    const slashRange = range.clone();
    slashRange.selectNodeContents(block);
    menu.show(slashRange, keyword);
  };
  editor.container.on('keyup', event => {
    if (editor.isComposing) {
      return;
    }
    const keyboardEvent = event as KeyboardEvent;
    if (isKeyHotkey(['down', 'up', 'enter'], keyboardEvent)) {
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
  };
};
