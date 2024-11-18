import { KeyValue } from '../types/object';
import { NodePath } from '../types/node';
import {
  blockTagNames, markTagNames, voidTagNames,
  headingTagNames, listTagNames, tableTagNames,
} from '../config/tag-names';
import { inString } from '../utils/in-string';
import { camelCase } from '../utils/camel-case';
import { getCSS } from '../utils/get-css';
import { toHex } from '../utils/to-hex';
import { toNodeList } from '../utils/to-node-list';
import { debug } from '../utils/debug';

type EventItem = {
  type: string;
  listener: EventListener;
};

// A key-value object for storing all events.
// value is an array which include types and listeners.
const eventData: { [key: number]: EventItem[] } = {};

let lastNodeId = 0;

// The Nodes class represents collections of nodes.
export class Nodes {
  // Returns native nodes that includes element, text node.
  private nodeList: Node[];

  // Represents the number of nodes in nodeList.
  public length: number;

  constructor(node?: Node | Node[] | null) {
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
    return node.nodeType === Node.ELEMENT_NODE;
  }

  // Returns a boolean value indicating whether the node is a text node.
  public get isText(): boolean {
    if (this.length === 0) {
      return false;
    }
    const node = this.get(0);
    return node.nodeType === Node.TEXT_NODE;
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

  // Returns a boolean value indicating whether the node is a table element.
  public get isTable(): boolean {
    if (this.length === 0) {
      return false;
    }
    return tableTagNames.has(this.name);
  }

  // Returns a boolean value indicating whether the node is a bookmark element.
  public get isBookmark(): boolean {
    return this.name === 'lake-bookmark';
  }

  // Returns a boolean value indicating whether the node is a box element.
  public get isBox(): boolean {
    return this.name === 'lake-box';
  }

  // Returns a boolean value indicating whether the node is a inline box element.
  public get isInlineBox(): boolean {
    return this.isBox && this.attr('type') === 'inline';
  }

  // Returns a boolean value indicating whether the node is a block box element.
  public get isBlockBox(): boolean {
    return this.isBox && this.attr('type') === 'block';
  }

  // Returns a boolean value indicating whether the element is a root element of contenteditable area.
  public get isContainer(): boolean {
    if (this.length === 0) {
      return false;
    }
    const node = this.get(0) as HTMLElement;
    return this.isElement && node.getAttribute('contenteditable') === 'true';
  }

  // Returns a boolean value indicating whether the node is ouside the container.
  public get isOutside(): boolean {
    return this.closest('[contenteditable="true"]').length === 0;
  }

  // Returns a boolean value indicating whether the node is inside the container.
  public get isInside(): boolean {
    return !this.isOutside && !this.isContainer;
  }

  // Returns a boolean value indicating whether the node is a top element inside the container.
  public get isTopInside(): boolean {
    if (this.length === 0) {
      return false;
    }
    const parentNode = this.parent();
    if (parentNode.length === 0) {
      return false;
    }
    return this.isInside && parentNode.isContainer;
  }

  // Returns a boolean value indicating whether the node is editable.
  public get isContentEditable(): boolean {
    if (this.length === 0) {
      return false;
    }
    if (this.isText) {
      const element = this.get(0).parentNode as HTMLElement;
      if (!element) {
        return false;
      }
      return element.isContentEditable;
    }
    if (!this.isElement) {
      return false;
    }
    const element = this.get(0) as HTMLElement;
    return element.isContentEditable;
  }

  // Returns a boolean value indicating whether the node is indivisible.
  public get isIndivisible(): boolean {
    return this.isContainer || this.isTable;
  }

  // Returns a boolean value indicating whether the node is empty.
  public get isEmpty(): boolean {
    if (this.isBox) {
      return false;
    }
    const nodeText = this.text();
    const isEmptyText = nodeText === '' || /^[\r\n\u200B\u2060]+$/.test(nodeText);
    if (!isEmptyText) {
      return false;
    }
    if (this.isElement) {
      if (this.find('lake-box').length > 0) {
        return false;
      }
      if (this.find('br').length > 1) {
        return false;
      }
    }
    return true;
  }

  // Gets a native node at the specified index.
  public get(index: number): Node {
    return this.nodeList[index];
  }

  // Gets all native nodes
  public getAll(): Node[] {
    return this.nodeList;
  }

  // Reduces the nodes of a Nodes object to the one at the specified index.
  public eq(index: number): Nodes {
    const node = this.get(index);
    return new Nodes(node);
  }

  // Iterates over a Nodes object, executing a function for each node.
  public each(callback: (element: Node, index: number) => boolean | void): this {
    const nodes = this.getAll();
    for (let i = 0; i < nodes.length; i++) {
      if (callback(nodes[i], i) === false) {
        return this;
      }
    }
    return this;
  }

  // Iterates over a Nodes object, executing a function for each element.
  public eachElement(callback: (element: Element, index: number) => boolean | void): this {
    const nodes = this.getAll();
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].nodeType === Node.ELEMENT_NODE) {
        if (callback(nodes[i] as Element, i) === false) {
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

  // Tests whether the element would be selected by the specified CSS selector.
  public matches(selector: string): boolean {
    if (!this.isElement) {
      return false;
    }
    const element = this.get(0) as Element;
    return element.matches(selector);
  }

  // Returns a boolean value indicating whether a node is a descendant of a given node, that is the node itself,
  // one of its direct children (childNodes), one of the children's direct children, and so on.
  public contains(otherNode: Node | Nodes): boolean {
    if (otherNode instanceof Nodes) {
      otherNode = otherNode.get(0);
    }
    const element = this.get(0) as Element;
    return element.contains(otherNode);
  }

  // Returns a boolean value indicating whether the node and the target node are siblings.
  public isSibling(target: Nodes): boolean {
    if (this.length === 0) {
      return false;
    }
    const parent = this.get(0).parentNode as HTMLElement;
    return parent && parent === target.parent().get(0);
  }

  // Returns the descendants of the first element which are selected by the specified CSS selector.
  public find(selector: string | NodePath): Nodes {
    if (typeof selector === 'string') {
      const element = this.get(0) as Element;
      const nodeList = element.querySelectorAll(selector);
      return new Nodes(Array.from(nodeList));
    }
    let node = this.eq(0);
    for (const index of selector) {
      node = node.children()[index];
      if (!node) {
        return new Nodes();
      }
    }
    return node;
  }

  // Traverses the first node and its parents (heading toward the document root)
  // until it finds a element that matches the specified CSS selector.
  public closest(selector: string): Nodes {
    if (this.isText) {
      const element = this.get(0).parentNode;
      if (!element) {
        return new Nodes();
      }
      return new Nodes((element as Element).closest(selector));
    }
    if (!this.isElement) {
      return new Nodes();
    }
    const element = this.get(0) as Element;
    return new Nodes(element.closest(selector));
  }

  // Traverses the first node and its parents until it finds a block element.
  public closestBlock() {
    let node = this.eq(0);
    while (node.length > 0) {
      if (node.isTopInside || node.isBlock) {
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
    const boxNode = this.closest('lake-box');
    const block = boxNode.length > 0 ? boxNode.closestBlock() : this.closestBlock();
    if (block.length === 0) {
      return block;
    }
    if (block.isTable) {
      return new Nodes();
    }
    const parentBlock = block.parent();
    if (block.name === 'li' && parentBlock.isList) {
      return parentBlock;
    }
    return block;
  }

  // Traverses the first node and its parents until it finds a root element which has contenteditable="true" attribute.
  public closestContainer(): Nodes {
    return this.closest('div[contenteditable="true"]');
  }

  // Traverses the first node and its parents until it finds an element which can scroll.
  public closestScroller(): Nodes {
    let parent = this.eq(0);
    while(parent.length > 0) {
      if (parent.isElement && ['scroll', 'auto'].indexOf(parent.computedCSS('overflow-y')) >= 0) {
        return parent;
      }
      parent = parent.parent();
    }
    return new Nodes();
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
    let sibling: Node | null = this.get(0);
    while (sibling) {
      i++;
      sibling = sibling.previousSibling;
    }
    return i;
  }

  // Returns a path of the first element.
  public path(): NodePath {
    const path: NodePath = [];
    let node = this.eq(0);
    if (node.isContainer) {
      return path;
    }
    while (node.length > 0) {
      const parent = node.parent();
      if (parent.length === 0) {
        break;
      }
      path.push(node.index());
      if (parent.isContainer) {
        break;
      }
      node = parent;
    }
    return path.reverse();
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
      if (node.isBox) {
        return;
      }
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
      for (let i = 0; i < eventItems.length; i++) {
        const item = eventItems[i];
        if (!type || type === item.type && (!listener || listener === item.listener)) {
          element.removeEventListener(item.type, item.listener, false);
          eventItems[i] = {
            type: '',
            listener: () => {},
          };
        }
      }
      eventData[elementId] = eventItems.filter((item: EventItem) => item.type !== '');
    });
  }

  // Executes all event listeners attached to the Nodes object for the given event type.
  public emit(type: string, event?: Event): this {
    return this.eachElement(element => {
      const elementId = element.lakeId;
      const eventItems = eventData[elementId];
      for (const item of eventItems) {
        if (item.type === type) {
          item.listener(event ?? new Event(type));
        }
      }
    });
  }

  // Gets all event listeners attached to the Nodes object.
  public getEventListeners(index: number): EventItem[] {
    const elementId = this.get(index).lakeId;
    return eventData[elementId];
  }

  // Sets focus on the specified element, if it can be focused.
  public focus(): this {
    const element = this.get(0) as HTMLElement;
    element.focus();
    return this;
  }

  // Removes focus from the specified element.
  public blur(): this {
    const element = this.get(0) as HTMLElement;
    element.blur();
    return this;
  }

  // Returns a duplicate of the first node.
  public clone(deep: boolean = false): Nodes {
    const node = this.get(0);
    return new Nodes(node.cloneNode(deep));
  }

  public hasAttr(attributeName: string): boolean {
    const element = this.get(0) as Element;
    return element.hasAttribute(attributeName);
  }

  public attr(attributeName: string): string;

  public attr(attributeName: string, value: string): this;

  public attr(attributeName: KeyValue): this;

  public attr(attributeName: any, value?: any): any {
    if (typeof attributeName === 'object') {
      for (const name of Object.keys(attributeName)) {
        this.attr(name, attributeName[name]);
      }
      return this;
    }
    if (value === undefined) {
      const element = this.get(0) as Element;
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
    const element = this.get(0) as Element;
    return inString(element.className, className, ' ');
  }

  public addClass(className: string | string[]): this {
    if (Array.isArray(className)) {
      for (const name of className) {
        this.addClass(name);
      }
      return this;
    }
    return this.eachElement(element => {
      if (inString(element.className, className, ' ')) {
        return;
      }
      element.classList.add(className);
    });
  }

  public removeClass(className: string | string[]): this {
    if (Array.isArray(className)) {
      for (const name of className) {
        this.removeClass(name);
      }
      return this;
    }
    return this.eachElement(element => {
      if (!inString(element.className, className, ' ')) {
        return;
      }
      element.classList.remove(className);
      if (element.className === '') {
        element.removeAttribute('class');
      }
    });
  }

  public computedCSS(propertyName: string): string {
    const element = this.get(0) as Element;
    return getCSS(element, propertyName);
  }

  public css(propertyName: string): string;

  public css(propertyName: KeyValue): this;

  public css(propertyName: string, value: string): this;

  public css(propertyName: any, value?: any): any {
    if (typeof propertyName === 'object') {
      for (const name of Object.keys(propertyName)) {
        this.css(name, propertyName[name]);
      }
      return this;
    }
    if (value === undefined) {
      const element = this.get(0) as Element;
      return toHex(element.style[camelCase(propertyName)]);
    }
    return this.eachElement(element => {
      element.style[camelCase(propertyName)] = value;
      if (element.getAttribute('style') === '') {
        element.removeAttribute('style');
      }
    });
  }

  // Returns the width of of the first element.
  public width(): number {
    const element = this.get(0) as HTMLElement;
    return element.offsetWidth;
  }

  // Returns the interior width of the first element, which does not include padding.
  public innerWidth() {
    const paddingLeft = Number.parseInt(this.computedCSS('padding-left'), 10) || 0;
    const paddingRight = Number.parseInt(this.computedCSS('padding-right'), 10) || 0;
    return this.width() - paddingLeft - paddingRight;
  }

  // Returns the height of of the first element.
  public height(): number {
    const element = this.get(0) as HTMLElement;
    return element.offsetHeight;
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
      const element = this.get(0) as Element;
      return element.innerHTML;
    }
    return this.eachElement(element => {
      element.innerHTML = value;
    });
  }

  public text(): string;

  public text(value: string): this;

  public text(value?: string): any {
    if (value === undefined) {
      const node = this.get(0);
      if (this.isText) {
        return node.nodeValue ?? '';
      }
      const element = node as HTMLElement;
      // https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/innerText
      return element.innerText.replace(/^\n+|\n+$/, '');
    }
    return this.eachElement(element => {
      (element as HTMLElement).innerText = value;
    });
  }

  public value(): string;

  public value(value: string): this;

  public value(value?: string): any {
    if (value === undefined) {
      const inputElement = this.get(0) as HTMLInputElement;
      return inputElement.value;
    }
    return this.eachElement(element => {
      (element as HTMLInputElement).value = value;
    });
  }

  public outerHTML(): string {
    const element = this.get(0) as Element;
    return element.outerHTML;
  }

  // Removes all child nodes of each element.
  public empty(): this {
    this.html('');
    return this;
  }

  // Inserts the specified content to the beginning of the first element.
  public prepend(content: string | Node | DocumentFragment | Nodes): this {
    const element = this.get(0);
    if (typeof content === 'string') {
      const list = toNodeList(content as string).reverse();
      for (const node of list) {
        if (element.firstChild) {
          element.insertBefore(node, element.firstChild);
        } else {
          element.appendChild(node);
        }
      }
      return this;
    }
    if (content instanceof Nodes) {
      content = content.get(0);
    }
    if (element.firstChild) {
      element.insertBefore(content, element.firstChild);
    } else {
      element.appendChild(content);
    }
    return this;
  }

  // Inserts the specified content to the end of the first element.
  public append(content: string | Node | DocumentFragment | Nodes): this {
    const element = this.get(0);
    if (typeof content === 'string') {
      const list = toNodeList(content as string);
      for (const node of list) {
        element.appendChild(node);
      }
      return this;
    }
    if (content instanceof Nodes) {
      content = content.get(0);
    }
    element.appendChild(content);
    return this;
  }

  // Inserts the specified content before the first node.
  public before(content: string | Node | DocumentFragment | Nodes): this {
    const node = this.get(0);
    if (!node.parentNode) {
      return this;
    }
    if (typeof content === 'string') {
      const list = toNodeList(content as string);
      for (const target of list) {
        node.parentNode.insertBefore(target, node);
      }
      return this;
    }
    if (content instanceof Nodes) {
      content = content.get(0);
    }
    node.parentNode.insertBefore(content, node);
    return this;
  }

  // Inserts the specified content after the first node.
  public after(content: string | Node | DocumentFragment | Nodes): this {
    const node = this.get(0);
    if (!node.parentNode) {
      return this;
    }
    if (typeof content === 'string') {
      const list = toNodeList(content as string).reverse();
      for (const target of list) {
        if (node.nextSibling) {
          node.parentNode.insertBefore(target, node.nextSibling);
        } else {
          node.parentNode.appendChild(target);
        }
      }
      return this;
    }
    if (content instanceof Nodes) {
      content = content.get(0);
    }
    if (node.nextSibling) {
      node.parentNode.insertBefore(content, node.nextSibling);
    } else {
      node.parentNode.appendChild(content);
    }
    return this;
  }

  // Replaces the first node with the provided new content.
  public replaceWith(newContent: string | Node | Nodes): this {
    const node = this.get(0);
    if (!node.parentNode) {
      return this;
    }
    let target: Node;
    if (newContent instanceof Nodes) {
      target = newContent.get(0);
    } else {
      target = toNodeList(newContent)[0];
    }
    node.parentNode.replaceChild(target, node);
    return this;
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
    const node = this.get(0) as Text;
    const newNode = node.splitText(offset);
    return new Nodes(newNode);
  }

  // Returns information of the first node.
  public toString(): string {
    if (this.length === 0) {
      return '';
    }
    const node = this.get(0);
    let nodeValue = this.isText ? node.nodeValue : this.outerHTML();
    if (nodeValue && nodeValue.length > 50) {
      nodeValue = `${nodeValue.substring(0, 50)} ...`;
    }
    return `node (${node.lakeId}): ${nodeValue}`;
  }

  // Prints information of the first node.
  public info(): void {
    debug(this.toString());
  }
}
