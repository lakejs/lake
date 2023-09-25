import { defaultRules } from '../constants/schema';
import { NativeElement } from '../types/native';
import { forEach, parseStyle } from '../utils';
import { Nodes } from './nodes';

export class HTMLParser {

  private root: Nodes;

  constructor(content: string | Nodes) {
    const parser = new DOMParser();
    if (typeof content === 'string') {
      const doc = parser.parseFromString(content, 'text/html');
      this.root = new Nodes(doc.querySelector('body'));
    } else {
      this.root = content;
    }
  }

  // Returns a boolan value indicating whether the node should be removed.
  private sanitizeNode(node: Nodes): void {
    const attributeRules = defaultRules[node.name];
    if (!attributeRules) {
      node.remove();
      return;
    }
    const nativeNode = node.get(0) as NativeElement;
    if (!nativeNode.hasAttributes()) {
      return;
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
  }

  public * getWalker(root: Nodes): Generator<Nodes> {
    function * iterate(node: Nodes): Generator<Nodes> {
      let child = node.first();
      while (child.length > 0) {
        const nextNode = child.next();
        yield child;
        yield * iterate(child);
        child = nextNode;
      }
    }
    for (const node of iterate(root.eq(0))) {
      yield node;
    }
  }

  public getNodeList(): Nodes[] {
    const nodeList: Nodes[] = [];
    if (this.root.length === 0) {
      return nodeList;
    }
    for (const node of this.getWalker(this.root)) {
      if (node.isElement) {
        this.sanitizeNode(node);
      }
    }
    return this.root.children();
  }
}
