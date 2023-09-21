import { Nodes } from '../models/nodes';
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
    editor.selection.insertContents(new Nodes(parser.getNodeList()));
  });
};
