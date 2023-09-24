import { defaultRules } from '../constants/schema';
import { NativeElement } from '../types/native';
import { forEach, parseStyle } from '../utils';
import { Nodes } from './nodes';

export class HTMLParser {

  private doc: Document;

  constructor(html: string) {
    const parser = new DOMParser();
    this.doc = parser.parseFromString(html, 'text/html');
  }

  // Returns a boolan value indicating whether the node should be removed.
  private sanitizeCurrentNode(node: Nodes): boolean {
    const attributeRules = defaultRules[node.name];
    if (!attributeRules) {
      return false;
    }
    const nativeNode = node.get(0) as NativeElement;
    if (!nativeNode.hasAttributes()) {
      return true;
    }
    for (const attr of nativeNode.attributes) {
      if (!attributeRules[attr.name]) {
        node.removeAttr(attr.name);
      } else {
        if (attr.name !== 'style' && attributeRules[attr.name].exec(attr.value) === null) {
          node.removeAttr(attr.name);
        }
        if (attr.name === 'style') {
          const styleRules = attributeRules.style;
          forEach(parseStyle(attr.value), (key, value) => {
            if (!styleRules[key]) {
              node.css(key, '');
            } else if (styleRules[key].exec(value) === null) {
              node.css(key, '');
            }
          });
          if (node.attr('style') === '') {
            node.removeAttr('style');
          }
        }
      }
    }
    return true;
  }

  public getNodeList(): Nodes[] {
    const nodeList: Nodes[] = [];
    const body = new Nodes(this.doc.querySelector('body'));
    if (body.length === 0) {
      return nodeList;
    }
    let child = body.first();
    while(child.length > 0) {
      const next = child.next();
      if (this.sanitizeCurrentNode(child)) {
        nodeList.push(child);
      }
      child = next;
    }
    return nodeList;
  }
}
