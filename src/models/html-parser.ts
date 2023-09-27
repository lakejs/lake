import { defaultRules } from '../constants/schema';
import { NativeElement } from '../types/native';
import { forEach, parseStyle } from '../utils';
import { Nodes } from './nodes';

const characterMap = new Map([
  ['&', '&amp;'],
  ['<', '&lt;'],
  ['>', '&gt;'],
  ['"', '&quot;'],
  ['\xA0', '&nbsp;'],
]);

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

  // Converts all of the reserved characters in the specified string to HTML entities.
  private static encode(value: string) {
    return value.replace(/[&<>"\xA0]/g, match => characterMap.get(match) ?? '');
  }

  // Returns a tag string of the node that do not match rules.
  private static getOpenTagString(element: Nodes) : string {
    const attributeRules = defaultRules[element.name];
    if (!attributeRules) {
      return '';
    }
    const nativeNode = element.get(0) as NativeElement;
    if (!nativeNode.hasAttributes()) {
      return element.name;
    }
    const attributeMap = new Map();
    for (const attr of nativeNode.attributes) {
      if (attributeRules[attr.name]) {
        if (attr.name !== 'style' && attributeRules[attr.name].test(attr.value)) {
          attributeMap.set(attr.name, attr.value);
        }
        if (attr.name === 'style') {
          const styleRules = attributeRules.style;
          const styleMap = new Map();
          forEach(parseStyle(attr.value), (key, value) => {
            if (styleRules[key] && styleRules[key].test(value)) {
              styleMap.set(key, value);
            }
          });
          attributeMap.set('style', styleMap);
        }
      }
    }
    let openTag = element.name;
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

  // Removes the element or those attributes or CSS properties that do not match rules.
  private sanitizeElement(element: Nodes) : void {
    const attributeRules = defaultRules[element.name];
    if (!attributeRules) {
      element.remove(true);
      return;
    }
    const nativeNode = element.get(0) as NativeElement;
    if (!nativeNode.hasAttributes()) {
      return;
    }
    for (const attr of nativeNode.attributes) {
      if (!attributeRules[attr.name]) {
        element.removeAttr(attr.name);
      } else {
        if (attr.name !== 'style' && !attributeRules[attr.name].test(attr.value)) {
          element.removeAttr(attr.name);
        }
        if (attr.name === 'style') {
          const styleRules = attributeRules.style;
          forEach(parseStyle(attr.value), (key, value) => {
            if (!styleRules[key]) {
              element.css(key, '');
            } else if (!styleRules[key].test(value)) {
              element.css(key, '');
            }
          });
          if (element.attr('style') === '') {
            element.removeAttr('style');
          }
        }
      }
    }
  }

  public getNodeList(): Nodes[] {
    for (const node of this.root.getWalker()) {
      if (node.isElement) {
        this.sanitizeElement(node);
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
          yield HTMLParser.encode(child.text());
        } else if (child.isVoid) {
          const openTag = HTMLParser.getOpenTagString(child);
          if (openTag !== '') {
            yield `<${openTag} />`;
          }
        } else {
          const openTag = HTMLParser.getOpenTagString(child);
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
