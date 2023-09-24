import { HTMLParser } from '../models/html-parser';
import type LakeCore from '../main';

// TODO
export default (editor: LakeCore) => {
  editor.container.on('paste', event => {
    event.preventDefault();
    const clipboardData = (event as ClipboardEvent).clipboardData;
    if (!clipboardData) {
      return;
    }
    const content = clipboardData.getData('text/html');
    const parser = new HTMLParser(content);
    for (const node of parser.getNodeList()) {
      editor.selection.insertContents(node);
    }
  });
};
