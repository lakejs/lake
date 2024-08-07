import type { Editor } from '..';
import { SlashPopup } from '../ui/slash-popup';

export default (editor: Editor) => {
  if (editor.readonly) {
    return;
  }
  const popup = new SlashPopup({
    editor,
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
    const block = range.getBlocks()[0];
    if (!block) {
      return;
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
    popup.show(slashRange);
  });
  let prevKeyword = '';
  editor.container.on('keyup', () => {
    if (!popup.visible) {
      return;
    }
    const range = editor.selection.range;
    const block = range.getBlocks()[0];
    if (!block) {
      return;
    }
    let text = block.text().trim();
    text = text.replace(/[\u200B\u2060]/g, '');
    if (text === '') {
      popup.hide();
      return;
    }
    const keyword = text.substring(1);
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
