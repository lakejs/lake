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

  // Removes the node or those attributes or CSS properties that do not match rules.
  private sanitizeNode(node: Nodes) : void {
    const attributeRules = defaultRules[node.name];
    if (!attributeRules) {
      node.remove(true);
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

  // Returns a tag string of the node that do not match rules.
  private static getOpenTag(node: Nodes) : string {
    const attributeRules = defaultRules[node.name];
    if (!attributeRules) {
      return '';
    }
    const nativeNode = node.get(0) as NativeElement;
    if (!nativeNode.hasAttributes()) {
      return node.name;
    }
    const attributeMap = new Map();
    for (const attr of nativeNode.attributes) {
      if (attributeRules[attr.name]) {
        if (attr.name !== 'style' && attributeRules[attr.name].exec(attr.value) !== null) {
          attributeMap.set(attr.name, attr.value);
        }
        if (attr.name === 'style') {
          const styleRules = attributeRules.style;
          const styleMap = new Map();
          forEach(parseStyle(attr.value), (key, value) => {
            if (styleRules[key] && styleRules[key].exec(value) !== null) {
              styleMap.set(key, value);
            }
          });
          attributeMap.set('style', styleMap);
        }
      }
    }
    let openTag = node.name;
    for (const [attrName, attrValue] of attributeMap) {
      if (attrName === 'style') {
        let styleString = '';
        for (const [styleName, styleValue] of attrValue) {
          styleString += `${styleName}: ${styleValue}; `;
        }
        openTag += ` style="${styleString.trim()}"`;
      } else {
        openTag += ` ${attrName}="${attrValue}"`;
      }
    }
    return openTag;
  }

  public getNodeList(): Nodes[] {
    for (const node of this.root.getWalker()) {
      if (node.isElement) {
        this.sanitizeNode(node);
      }
    }
    return this.root.children();
  }

  public getHTML(): string {
    function * iterate(node: Nodes): Generator<string> {
      let child = node.first();
      while (child.length > 0) {
        const nextNode = child.next();
        if (child.isText) {
          yield child.text();
        } else if (child.isVoid) {
          const openTag = HTMLParser.getOpenTag(child);
          if (openTag !== '') {
            yield `<${openTag} />`;
          }
        } else {
          const openTag = HTMLParser.getOpenTag(child);
          if (openTag !== '') {
            yield `<${openTag}>`;
          }
          yield * iterate(child);
          if (openTag !== '') {
            yield `</${child.name}>`;
          }
        }
        child = nextNode;
      }
    }
    let html = '';
    for (const value of iterate(this.root)) {
      html += value;
    }
    return html;
  }
}
