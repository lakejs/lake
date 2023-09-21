import { NativeNode } from '../types/native';

export class HTMLParser {

  private doc: Document;

  constructor(html: string) {
    const parser = new DOMParser();
    this.doc = parser.parseFromString(html, 'text/html');
  }

  getNodeList(): NativeNode[] {
    const nodeList: NativeNode[] = [];
    const body = this.doc.querySelector('body');
    if (!body) {
      return nodeList;
    }
    let child = body.firstChild;
    while(child) {
      const nextSibling = child.nextSibling;
      nodeList.push(child);
      child = nextSibling;
    }
    return nodeList;
  }
}
