import { getDefaultRules } from '../constants/schema';
import { NativeElement } from '../types/native';
import { forEach, parseStyle, encode } from '../utils';
import { Nodes } from './nodes';

export class HTMLParser {

  private rules: any;

  private source: Nodes;

  constructor(content: string | Nodes, rules = getDefaultRules()) {
    this.rules = rules;
    if (typeof content === 'string') {
      this.source = this.parseHTML(content);
    } else {
      this.source = content;
    }
  }

  // Parses HTML string and returns the resulting body element.
  private parseHTML(html: string): Nodes {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    return new Nodes(doc.querySelector('body'));
  }

  // Returns a boolean indicating whether a value matches the specified rule.
  private static matchRule(rule: any, value: string): boolean {
    if (typeof rule === 'string') {
      return rule === value;
    }
    if (Array.isArray(rule)) {
      return rule.indexOf(value) >= 0;
    }
    if (rule instanceof RegExp) {
      return rule.test(value);
    }
    return false;
  }

  // Returns a tag string of the node that do not match rules.
  private static getOpenTagString(element: Nodes, rules: any) : string {
    const attributeRules = rules[element.name];
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
        if (attr.name !== 'style' && HTMLParser.matchRule(attributeRules[attr.name], attr.value)) {
          attributeMap.set(attr.name, attr.value);
        }
        if (attr.name === 'style') {
          const styleRules = attributeRules.style;
          const styleMap = new Map();
          forEach(parseStyle(attr.value), (key, value) => {
            if (styleRules[key] && HTMLParser.matchRule(styleRules[key], value)) {
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
        if (styleString !== '') {
          openTag += ` style="${styleString.trim()}"`;
        }
      } else {
        openTag += ` ${attrName}="${attrValue}"`;
      }
    }
    return openTag;
  }

  // Returns the value of the text node with trimming invisible whitespace.
  // <p>foo</p>\n<p>bar</p>
  // or
  // <p>\nfoo\n</p>
  private static getTrimmedText(textNode: Nodes): string {
    const parentNode = textNode.parent();
    const prevSibling = textNode.prev();
    const nextSibling = textNode.next();
    let nodeValue = textNode.text();
    if (
      prevSibling.length > 0 && !prevSibling.isMark &&
      nextSibling.length > 0 && !nextSibling.isMark ||
      prevSibling.length === 0 && nextSibling.length === 0 && parentNode.isBlock
    ) {
      nodeValue = nodeValue.trim();
    } else if (
      prevSibling.length > 0 && !prevSibling.isMark ||
      prevSibling.length === 0 && parentNode.isBlock)
    {
      nodeValue = nodeValue.replace(/^[\s\r\n]+/, '');
    } else if (
      nextSibling.length > 0 && !nextSibling.isMark ||
      nextSibling.length === 0 && parentNode.isBlock
    ) {
      nodeValue = nodeValue.replace(/[\s\r\n]+$/, '');
    }
    return nodeValue;
  }

  public getHTML(): string {
    const rules = this.rules;
    function * iterate(node: Nodes): Generator<string> {
      let child = node.first();
      while (child.length > 0) {
        const nextNode = child.next();
        if (child.isText) {
          yield encode(HTMLParser.getTrimmedText(child));
        } else if (child.isVoid) {
          const openTag = HTMLParser.getOpenTagString(child, rules);
          if (openTag !== '') {
            yield `<${openTag} />`;
          }
        } else if (child.isElement) {
          const openTag = HTMLParser.getOpenTagString(child, rules);
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
    for (const value of iterate(this.source)) {
      html += value;
    }
    return html.trim();
  }

  public getNodeList(): Nodes[] {
    const html = this.getHTML();
    const body = this.parseHTML(html);
    return body.children();
  }

  public getFragment(): DocumentFragment {
    const html = this.getHTML();
    const body = this.parseHTML(html);
    const fragment = document.createDocumentFragment();
    body.get(0).childNodes.forEach(node => {
      fragment.appendChild(node.cloneNode(true));
    });
    return fragment;
  }
}
