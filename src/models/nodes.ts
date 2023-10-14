import { KeyValue } from '../types/object';
import {
  NativeHTMLElement, NativeElement,
  NativeNode, NativeText,
} from '../types/native';
import {
  blockTagNames, markTagNames, voidTagNames,
  headingTagNames, listTagNames,
} from '../constants/tag-names';
import { forEach } from '../utils/for-each';
import { inString } from '../utils/in-string';
import { camelCase } from '../utils/camel-case';
import { getCSS } from '../utils/get-css';
import { toHex } from '../utils/to-hex';
import { toNodeList } from '../utils/to-node-list';
import { debug } from '../utils/debug';

type EachCallback = (element: NativeNode, index: number) => boolean | void;
type EachElementCallback = (element: NativeElement, index: number) => boolean | void;

type EventItem = {
  type: string,
  listener: EventListener,
};

// Is a key-value object for storing all events.
// value is an array which include types and listeners.
const eventData: { [key: number]: EventItem[] } = {};

let lastNodeId = 0;

export class Nodes {
  // Returns native nodes that includes element, text node.
  private nodeList: NativeNode[];

  // Represents the number of nodes in nodeList.
  public length: number;

  constructor(node?: NativeNode | NativeNode[] | null) {
    node = node ?? [];
    this.nodeList = Array.isArray(node) ? node : [node];
    for (let i = 0; i < this.nodeList.length; i++) {
      // lakeId is an expando for preserving node ID.
      // https://developer.mozilla.org/en-US/docs/Glossary/Expando
      if (!this.nodeList[i].lakeId) {
        this.nodeList[i].lakeId = ++lastNodeId;
      }
    }
    this.length = this.nodeList.length;
  }

  // Returns node ID at the first index.
  public get id(): number {
    const node = this.get(0);
    return node.lakeId;
  }

  // Returns node name at the first index.
  public get name(): string {
    if (this.length === 0) {
      return '';
    }
    const node = this.get(0);
    return node.nodeName.toLowerCase();
  }

  // Returns a boolean value indicating whether the node is an element.
  public get isElement(): boolean {
    if (this.length === 0) {
      return false;
    }
    const node = this.get(0);
    return node.nodeType === NativeNode.ELEMENT_NODE;
  }

  // Returns a boolean value indicating whether the node is a text node.
  public get isText(): boolean {
    if (this.length === 0) {
      return false;
    }
    const node = this.get(0);
    return node.nodeType === NativeNode.TEXT_NODE;
  }

  // Returns a boolean value indicating whether the node is a block element.
  public get isBlock(): boolean {
    if (this.length === 0) {
      return false;
    }
    return blockTagNames.has(this.name);
  }

  // Returns a boolean value indicating whether the node is a mark element.
  public get isMark(): boolean {
    if (this.length === 0) {
      return false;
    }
    return markTagNames.has(this.name);
  }

  // Returns a boolean value indicating whether the node is a void element.
  public get isVoid(): boolean {
    if (this.length === 0) {
      return false;
    }
    return voidTagNames.has(this.name);
  }

  // Returns a boolean value indicating whether the node is a heading element.
  public get isHeading(): boolean {
    if (this.length === 0) {
      return false;
    }
    return headingTagNames.has(this.name);
  }

  // Returns a boolean value indicating whether the node is a list element.
  public get isList(): boolean {
    if (this.length === 0) {
      return false;
    }
    return listTagNames.has(this.name);
  }

  // Returns a boolean value indicating whether the node is a bookmark element.
  public get isBookmark(): boolean {
    return this.name === 'bookmark';
  }

  // Returns a boolean value indicating whether the element is a root element of contenteditable area.
  public get isContainer(): boolean {
    if (this.length === 0) {
      return false;
    }
    const node = this.get(0) as NativeHTMLElement;
    return this.isElement && node.getAttribute('contenteditable') === 'true';
  }

  // Returns a boolean value indicating whether the node is editable or the node is a root element of contenteditable area.
  public get isContentEditable(): boolean {
    if (this.length === 0) {
      return false;
    }
    if (this.isText) {
      const element = this.get(0).parentNode as NativeHTMLElement;
      if (!element) {
        return false;
      }
      return element.isContentEditable;
    }
    if (!this.isElement) {
      return false;
    }
    const element = this.get(0) as NativeHTMLElement;
    return element.isContentEditable;
  }

  // Returns a boolean value indicating whether the node is editable.
  public get isEditable(): boolean {
    return this.isContentEditable && !this.isContainer;
  }

  // Returns a boolean value indicating whether the node is an editable top node.
  public get isTopEditable(): boolean {
    if (this.length === 0) {
      return false;
    }
    const parent = this.parent();
    if (parent.length === 0) {
      return false;
    }
    return this.isEditable && parent.isContainer;
  }

  // Returns a boolean value indicating whether the node is an empty node.
  public get hasEmptyText(): boolean {
    const nodeText = this.text();
    return nodeText === '' || nodeText === '\u200B' || nodeText === '\u2060';
  }

  // Returns a boolean value indicating whether the node and the target node are siblings.
  public isSibling(target: Nodes): boolean {
    if (this.length === 0) {
      return false;
    }
    const parent = this.get(0).parentNode as NativeHTMLElement;
    return parent && parent === target.parent().get(0);
  }

  // Gets a native node at the specified index.
  public get(index: number = 0): NativeNode {
    return this.nodeList[index];
  }

  // Gets all native nodes
  public getAll(): NativeNode[] {
    return this.nodeList;
  }

  // Reduces the nodes of a Nodes object to the one at the specified index.
  public eq(index: number): Nodes {
    const node = this.get(index);
    return new Nodes(node);
  }

  // Iterates over a Nodes object, executing a function for each node.
  public each(callback: EachCallback): this {
    const nodes = this.getAll();
    for (let i = 0; i < nodes.length; i++) {
      if (callback(nodes[i], i) === false) {
        return this;
      }
    }
    return this;
  }

  // Iterates over a Nodes object, executing a function for each element.
  public eachElement(callback: EachElementCallback): this {
    const nodes = this.getAll();
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].nodeType === NativeNode.ELEMENT_NODE) {
        if (callback(nodes[i] as NativeElement, i) === false) {
          return this;
        }
      }
    }
    return this;
  }

  // Reverses the nodes of a Nodes object.
  public reverse(): Nodes {
    const nodes = this.getAll().reverse();
    return new Nodes(nodes);
  }

  // Gets the descendants of the first element filtered by a selector.
  public find(selector: string): Nodes {
    const element = this.get(0) as NativeElement;
    const nodeList = element.querySelectorAll(selector);
    return new Nodes(Array.from(nodeList));
  }

  // Traverses the first node and its parents (heading toward the document root)
  // until it finds a element that matches the specified CSS selector.
  public closest(selector: string): Nodes {
    if (this.isText) {
      const element = this.get(0).parentNode;
      if (!element) {
        return new Nodes();
      }
      return new Nodes((element as NativeElement).closest(selector));
    }
    if (!this.isElement) {
      return new Nodes();
    }
    const element = this.get(0) as NativeElement;
    return new Nodes(element.closest(selector));
  }

  // Traverses the first node and its parents until it finds a block element.
  public closestBlock() {
    let node = this.eq(0);
    while (node.length > 0) {
      if (node.isTopEditable || node.isBlock) {
        break;
      }
      node = node.parent();
    }
    if (!node.isBlock) {
      return new Nodes();
    }
    return node;
  }

  // Traverses the first node and its parents until it finds an operable block.
  public closestOperableBlock(): Nodes {
    const block = this.closestBlock();
    if (block.length === 0) {
      return block;
    }
    const parentBlock = block.parent();
    if (block.name === 'li' && parentBlock.isList) {
      return parentBlock;
    }
    return block;
  }

  // Traverses the first node and its parents until it finds a root element which has contenteditable="true" attribute..
  public closestContainer(): Nodes {
    return this.closest('div[contenteditable="true"]');
  }

  // Returns the parent of the first node.
  public parent(): Nodes {
    const node = this.get(0);
    return new Nodes(node.parentNode);
  }

  // Returns the immediately preceding sibling of the first node.
  public prev(): Nodes {
    const node = this.get(0);
    return new Nodes(node.previousSibling);
  }

  // Returns the immediately following sibling of the first node.
  public next(): Nodes {
    const node = this.get(0);
    return new Nodes(node.nextSibling);
  }

  // Returns the first child of the first element.
  public first(): Nodes {
    const element = this.get(0);
    return new Nodes(element.firstChild);
  }

  // Returns the last child of the first element.
  public last(): Nodes {
    const element = this.get(0);
    return new Nodes(element.lastChild);
  }

  // Returns a number indicating the position of the first node relative to its sibling nodes.
  public index(): number {
    let i = -1;
    let sibling: NativeNode | null = this.get(0);
    while (sibling) {
      i++;
      sibling = sibling.previousSibling;
    }
    return i;
  }

  // Returns a list of child nodes of the first element.
  public children(): Nodes[] {
    const childList: Nodes[] = [];
    let child = this.first();
    while (child.length > 0) {
      childList.push(child);
      child = child.next();
    }
    return childList;
  }

  // Returns a node generator that iterates over the descendants of the first element.
  public * getWalker(): Generator<Nodes> {
    function * iterate(node: Nodes): Generator<Nodes> {
      let child = node.first();
      while (child.length > 0) {
        const nextNode = child.next();
        yield child;
        yield * iterate(child);
        child = nextNode;
      }
    }
    for (const node of iterate(this.eq(0))) {
      yield node;
    }
  }

  // Attaches an event listener for the elements.
  public on(type: string, listener: EventListener): this {
    return this.eachElement(element => {
      element.addEventListener(type, listener, false);
      const elementId = element.lakeId;
      if (!eventData[elementId]) {
        eventData[elementId] = [];
      }
      eventData[elementId].push({
        type,
        listener,
      });
    });
  }

  // Removes event handlers that were attached with .on() method.
  public off(type?: string, listener?: EventListener): this {
    return this.eachElement(element => {
      const elementId = element.lakeId;
      const eventItems = eventData[elementId] ?? [];
      eventItems.forEach((item, index) => {
        if (!type || type === item.type && (!listener || listener === item.listener)) {
          element.removeEventListener(item.type, item.listener, false);
          eventItems[index] = {
            type: '',
            listener: () => {},
          };
        }
      });
      eventData[elementId] = eventItems.filter((item: EventItem) => item.type !== '');
    });
  }

  // Executes all event listeners attached to the Nodes object for the given event type.
  public emit(type: string): this {
    return this.eachElement(element => {
      const elementId = element.lakeId;
      const eventItems = eventData[elementId];
      eventItems.forEach(item => {
        if (item.type === type) {
          item.listener(new Event(type));
        }
      });
    });
  }

  // Gets all event listeners attached to the Nodes object.
  public getEventListeners(index: number): EventItem[] {
    const elementId = this.get(index).lakeId;
    return eventData[elementId];
  }

  // Sets focus on the specified element, if it can be focused.
  public focus(): this {
    const element = this.get(0) as NativeHTMLElement;
    element.focus();
    return this;
  }

  // Removes focus from the specified element.
  public blur(): this {
    const element = this.get(0) as NativeHTMLElement;
    element.blur();
    return this;
  }

  // Returns a duplicate of the first node.
  public clone(deep: boolean = false): Nodes {
    const node = this.get(0);
    return new Nodes(node.cloneNode(deep));
  }

  public hasAttr(attributeName: string): boolean {
    const element = this.get(0) as NativeElement;
    return element.hasAttribute(attributeName);
  }

  public attr(attributeName: string): string;

  public attr(attributeName: string, value: string): this;

  public attr(attributeName: KeyValue): this;

  public attr(attributeName: any, value?: any): any {
    if (typeof attributeName === 'object') {
      forEach(attributeName, (name, val) => {
        this.attr(name, val);
      });
      return this;
    }
    if (value === undefined) {
      const element = this.get(0) as NativeElement;
      return element.getAttribute(attributeName) ?? '';
    }
    return this.eachElement(element => {
      element.setAttribute(attributeName, value);
    });
  }

  public removeAttr(attributeName: string): this {
    return this.eachElement(element => {
      element.removeAttribute(attributeName);
    });
  }

  public hasClass(className: string): boolean {
    const element = this.get(0) as NativeElement;
    return inString(element.className, className, ' ');
  }

  public addClass(className: string | string[]): this {
    if (Array.isArray(className)) {
      className.forEach(name => {
        this.addClass(name);
      });
      return this;
    }
    return this.eachElement(element => {
      element.classList.add(className);
    });
  }

  public removeClass(className: string | string[]): this {
    if (Array.isArray(className)) {
      className.forEach(name => {
        this.removeClass(name);
      });
      return this;
    }
    return this.eachElement(element => {
      element.classList.remove(className);
      if (element.className === '') {
        element.removeAttribute('class');
      }
    });
    return this;
  }

  public computedCSS(propertyName: string): string {
    const element = this.get(0) as NativeElement;
    return getCSS(element, propertyName);
  }

  public css(propertyName: string): string;

  public css(propertyName: KeyValue): this;

  public css(propertyName: string, value: string): this;

  public css(propertyName: any, value?: any): any {
    if (typeof propertyName === 'object') {
      forEach(propertyName, (name, val) => {
        this.css(name, val);
      });
      return this;
    }
    if (value === undefined) {
      const element = this.get(0) as NativeElement;
      return toHex(element.style[camelCase(propertyName)]);
    }
    return this.eachElement(element => {
      element.style[camelCase(propertyName)] = value;
    });
  }

  public show(displayType: string = 'block'): this {
    this.css('display', displayType);
    return this;
  }

  public hide(): this {
    this.css('display', 'none');
    return this;
  }

  public html(): string;

  public html(value: string): this;

  public html(value?: any): any {
    if (value === undefined) {
      const element = this.get(0) as NativeElement;
      return element.innerHTML;
    }
    return this.eachElement(element => {
      element.innerHTML = value;
    });
  }

  public text(): string {
    const node = this.get(0);
    if (this.isText) {
      return node.nodeValue ?? '';
    }
    const element = node as NativeHTMLElement;
    // https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/innerText
    return element.innerText;
  }

  // Removes all child nodes of each element.
  public empty(): this {
    this.html('');
    return this;
  }

  // Inserts the specified content as the first child of each element.
  public prepend(content: string | NativeNode | Nodes): this {
    return this.eachElement(element => {
      let list: NativeNode[] = [];
      if (content instanceof Nodes) {
        list = content.getAll();
      } else {
        list = toNodeList(content);
      }
      list = list.reverse();
      list.forEach((node: NativeNode) => {
        if (element.firstChild) {
          element.insertBefore(node, element.firstChild);
        } else {
          element.appendChild(node);
        }
      });
    });
  }

  // Inserts the specified content as the last child of each element.
  public append(content: string | NativeNode | Nodes): this {
    return this.eachElement(element => {
      let list: NativeNode[] = [];
      if (content instanceof Nodes) {
        list = content.getAll();
      } else {
        list = toNodeList(content);
      }
      list.forEach((node: NativeNode) => {
        element.appendChild(node);
      });
    });
  }

  // Inserts the specified content before each node.
  public before(content: string | NativeNode | Nodes): this {
    return this.each(node => {
      let list: NativeNode[] = [];
      if (content instanceof Nodes) {
        list = content.getAll();
      } else {
        list = toNodeList(content);
      }
      list.forEach(target => {
        if (!node.parentNode) {
          return;
        }
        node.parentNode.insertBefore(target, node);
      });
    });
  }

  // Inserts the specified content after each node.
  public after(content: string | NativeNode | Nodes): this {
    return this.each(node => {
      let list: NativeNode[] = [];
      if (content instanceof Nodes) {
        list = content.getAll();
      } else {
        list = toNodeList(content);
      }
      list = list.reverse();
      list.forEach(target => {
        if (!node.parentNode) {
          return;
        }
        if (node.nextSibling) {
          node.parentNode.insertBefore(target, node.nextSibling);
        } else {
          node.parentNode.appendChild(target);
        }
      });
    });
  }

  // Replaces each node with the provided new content.
  public replaceWith(newContent: string | NativeNode | Nodes): this {
    return this.each(node => {
      let target: NativeNode;
      if (newContent instanceof Nodes) {
        target = newContent.get(0);
      } else {
        target = toNodeList(newContent)[0];
      }
      if (!node.parentNode) {
        return;
      }
      node.parentNode.replaceChild(target, node);
    });
  }

  // Removes each node from the DOM.
  // keepChildren parameter:
  // A boolean value; true only removes each node and keeps all descended nodes; false removes the descendants; if omitted, it defaults to false.
  public remove(keepChildren: boolean = false): this {
    this.each(node => {
      if (!node.parentNode) {
        return;
      }
      if (keepChildren) {
        let child = node.firstChild;
        while (child) {
          const next = child.nextSibling;
          node.parentNode.insertBefore(child, node);
          child = next;
        }
      }
      node.parentNode.removeChild(node);
    });
    return this;
  }

  // Breaks the first text node into two nodes at the specified offset, keeping both nodes in the tree as siblings.
  public splitText(offset: number): Nodes {
    if (!this.isText) {
      return new Nodes();
    }
    const node = this.get(0) as NativeText;
    const newNode = node.splitText(offset);
    return new Nodes(newNode);
  }

  // Returns information of the first node.
  public toString(): string {
    const node = this.get(0);
    let nodeValue = this.isText ? node.nodeValue : (node as NativeElement).outerHTML;
    if (nodeValue && nodeValue.length > 50) {
      nodeValue = `${nodeValue.substring(0, 50)} ...`;
    }
    return `node (${node.lakeId}): ${nodeValue}`;
  }

  // Prints information of the first node.
  public debug(): void {
    debug(this.toString());
  }
}
