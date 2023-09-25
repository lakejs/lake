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
    const htmlParser = new HTMLParser(content);
    for (const node of htmlParser.getNodeList()) {
      editor.selection.insertContents(node);
    }
  });
};
