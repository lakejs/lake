import { getElementRules } from '../config/element-rules';
import { parseStyle } from '../utils/parse-style';
import { encode } from '../utils/encode';
import { Nodes } from '../models/nodes';

// The HTMLParser interface provides the ability to parse an HTML string by specified rules.
export class HTMLParser {

  private readonly rules: any;

  private readonly source: Nodes;

  constructor(content: string | Nodes, rules = getElementRules()) {
    this.rules = rules;
    if (typeof content === 'string') {
      this.source = this.parseHTML(content);
    } else {
      this.source = content;
    }
  }

  // Parses the given HTML string and returns the body element from the result.
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

  // Returns an open tag string of the specified element.
  private static getOpenTagString(element: Nodes, rules: any): string {
    let tagName = element.name;
    let attributeRules = rules[tagName];
    if (!attributeRules) {
      return '';
    }
    if (typeof attributeRules === 'string') {
      tagName = attributeRules;
      attributeRules = rules[tagName];
    }
    const nativeNode = element.get(0) as Element;
    if (!nativeNode.hasAttributes()) {
      return tagName;
    }
    const attributeMap = new Map<string, string | Map<string, string>>();
    for (const attr of nativeNode.attributes) {
      if (attributeRules[attr.name]) {
        if (attr.name !== 'style' && HTMLParser.matchRule(attributeRules[attr.name], attr.value)) {
          attributeMap.set(attr.name, attr.value);
        }
        if (attr.name === 'style') {
          const styleRules = attributeRules.style;
          const styleMap = new Map<string, string>();
          const styleData = parseStyle(attr.value);
          for (const key of Object.keys(styleData)) {
            const value = styleData[key];
            if (styleRules[key] && HTMLParser.matchRule(styleRules[key], value)) {
              styleMap.set(key, value);
            }
          }
          attributeMap.set('style', styleMap);
        }
      }
    }
    let openTag = tagName;
    for (const [attrName, attrValue] of attributeMap) {
      if (attrName === 'style') {
        let styleString = '';
        for (const [styleName, styleValue] of attrValue) {
          styleString += `${styleName}: ${styleValue.replace(/"/g, '&quot;')}; `;
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

  // Returns a closed tag string of the specified element.
  private static getClosedTagString(element: Nodes, rules: any): string {
    let tagName = element.name;
    const attributeRules = rules[tagName];
    if (!attributeRules) {
      return '';
    }
    if (typeof attributeRules === 'string') {
      tagName = attributeRules;
    }
    return tagName;
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
      ((prevSibling.isBlock || prevSibling.isBlockBox) && (nextSibling.isBlock || nextSibling.isBlockBox))
      || (prevSibling.length === 0 && nextSibling.length === 0 && parentNode.isBlock)
    ) {
      nodeValue = nodeValue.replace(/^[\u0020\t\r\n]+|[\u0020\t\r\n]+$/g, '');
    } else if (
      (prevSibling.isBlock || prevSibling.isBlockBox)
      || (prevSibling.length === 0 && parentNode.isBlock)
    ) {
      nodeValue = nodeValue.replace(/^[\u0020\t\r\n]+/, '');
    } else if (
      (nextSibling.isBlock || nextSibling.isBlockBox)
      || (nextSibling.length === 0 && parentNode.isBlock)
    ) {
      nodeValue = nodeValue.replace(/[\u0020\t\r\n]+$/, '');
    }
    return nodeValue;
  }

  // Returns an HTML string.
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
          const closedTag = HTMLParser.getClosedTagString(child, rules);
          if (openTag !== '') {
            yield `<${openTag}>`;
          }
          if (!child.isBox) {
            yield * iterate(child);
          }
          if (closedTag !== '') {
            yield `</${closedTag}>`;
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

  // Returns a DocumentFragment object.
  public getFragment(): DocumentFragment {
    const html = this.getHTML();
    const body = this.parseHTML(html);
    const fragment = document.createDocumentFragment();
    let child = body.first();
    while (child.length > 0) {
      const nextNode = child.next();
      fragment.appendChild(child.get(0));
      child = nextNode;
    }
    return fragment;
  }
}
