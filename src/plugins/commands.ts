import { isKeyHotkey } from 'is-hotkey';
import type { Editor } from '..';
import { CommandsPopup } from '../ui/commands-popup';

const commandItems: string[] = [
  'codeBlock',
  'equation',
  'codeBlock',
  'equation',
  'codeBlock',
  'equation',
  'codeBlock',
  'equation',
  'codeBlock',
  'equation',
  'codeBlock',
  'equation',
];

export default (editor: Editor) => {
  if (editor.readonly) {
    return;
  }
  const popup = new CommandsPopup({
    editor,
    items: commandItems,
  });
  editor.root.on('scroll', () => {
    popup.updatePosition();
  });
  editor.event.on('resize', () => {
    popup.updatePosition();
  });
  editor.keystroke.setKeyup('/', () => {
    const range = editor.selection.range;
    if (range.isInsideBox) {
      return;
    }
    if (!range.isCollapsed) {
      return;
    }
    let block = range.getBlocks()[0];
    if (!block) {
      editor.selection.setBlocks('<p />');
      block = range.getBlocks()[0];
    }
    if (block.find('lake-box').length > 0) {
      return;
    }
    let text = block.text().trim();
    text = text.replace(/[\u200B\u2060]/g, '');
    if (text !== '/') {
      return;
    }
    const slashRange = range.clone();
    slashRange.selectNodeContents(block);
    slashRange.info();
    popup.show(slashRange);
  });
  editor.container.on('keydown', event => {
    const keyboardEvent = event as KeyboardEvent;
    if (!popup.visible) {
      return;
    }
    if (
      isKeyHotkey('left', keyboardEvent) ||
      isKeyHotkey('right', keyboardEvent) ||
      isKeyHotkey('up', keyboardEvent) ||
      isKeyHotkey('down', keyboardEvent) ||
      isKeyHotkey('enter', keyboardEvent)
    ) {
      keyboardEvent.preventDefault();
      return;
    }
    popup.hide();
  });
};
