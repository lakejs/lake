import { HTMLParser } from '../models/html-parser';
import { TextParser } from '../models/text-parser';
import type Editor from '..';

export default (editor: Editor) => {
  editor.container.on('paste', event => {
    event.preventDefault();
    const clipboardData = (event as ClipboardEvent).clipboardData;
    if (!clipboardData) {
      return;
    }
    const isPlainText = (clipboardData.types.length === 1);
    if (isPlainText) {
      const content = clipboardData.getData('text/plain');
      const textParser = new TextParser(content);
      editor.selection.insertContents(textParser.getHTML());
      return;
    }
    const content = clipboardData.getData('text/html');
    const htmlParser = new HTMLParser(content);
    const fragment = htmlParser.getFragment();
    editor.selection.insertFragment(fragment);
  });
};
