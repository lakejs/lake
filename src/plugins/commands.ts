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
    const startText = range.getStartText();
    if (startText !== '/') {
      return;
    }
    const slashRange = range.clone();
    slashRange.setStart(range.startNode, range.startOffset - 1);
    slashRange.info();
    popup.show(slashRange);
  });
  editor.container.on('keydown', () => {
    popup.hide();
  });
};
