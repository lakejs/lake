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

interface EventItem {
  type: string;
  listener: EventListener;
}

/**
 * A key-value object for storing all events.
 * The value is an array which include types and listeners.
 */
const eventData: Record<number, EventItem[]> = {};

let lastNodeId = 0;

/**
 * The Nodes interface represents a collection of the nodes.
 * It is similar to jQuery, but its implementation is much simpler.
 * Its methods can be considered aliases of native DOM interfaces, designed to simplify DOM manipulation.
 */
export class Nodes {
  /**
   * A list of native nodes.
   */
  private readonly nodeList: Node[];

  /**
   * The number of nodes in the Nodes object.
   */
  public readonly length: number;

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

  /**
   * The unique ID of the first node.
   */
  public get id(): number {
    const node = this.get(0);
    return node.lakeId;
  }

  /**
   * The name of the first node.
   */
  public get name(): string {
    if (this.length === 0) {
      return '';
    }
    const node = this.get(0);
    return node.nodeName.toLowerCase();
  }

  /**
   * A boolean value indicating whether the first node is an element.
   */
  public get isElement(): boolean {
    if (this.length === 0) {
      return false;
    }
    const node = this.get(0);
    return node.nodeType === Node.ELEMENT_NODE;
  }

  /**
   * A boolean value indicating whether the first node is a text.
   */
  public get isText(): boolean {
    if (this.length === 0) {
      return false;
    }
    const node = this.get(0);
    return node.nodeType === Node.TEXT_NODE;
  }

  /**
   * A boolean value indicating whether the first node is a block.
   */
  public get isBlock(): boolean {
    if (this.length === 0) {
      return false;
    }
    return blockTagNames.has(this.name);
  }

  /**
   * A boolean value indicating whether the first node is a mark.
   */
  public get isMark(): boolean {
    if (this.length === 0) {
      return false;
    }
    return markTagNames.has(this.name);
  }

  /**
   * A boolean value indicating whether the first node is a void element that cannot have any child nodes.
   */
  public get isVoid(): boolean {
    if (this.length === 0) {
      return false;
    }
    return voidTagNames.has(this.name);
  }

  /**
   * A boolean value indicating whether the first node is a heading.
   */
  public get isHeading(): boolean {
    if (this.length === 0) {
      return false;
    }
    return headingTagNames.has(this.name);
  }

  /**
   * A boolean value indicating whether the first node is a list.
   */
  public get isList(): boolean {
    if (this.length === 0) {
      return false;
    }
    return listTagNames.has(this.name);
  }

  /**
   * A boolean value indicating whether the first node is a table.
   */
  public get isTable(): boolean {
    if (this.length === 0) {
      return false;
    }
    return tableTagNames.has(this.name);
  }

  /**
   * A boolean value indicating whether the first node is a bookmark element.
   */
  public get isBookmark(): boolean {
    return this.name === 'lake-bookmark';
  }

  /**
   * A boolean value indicating whether the first node is a box element.
   */
  public get isBox(): boolean {
    return this.name === 'lake-box';
  }

  /**
   * A boolean value indicating whether the first node is an inline box element.
   */
  public get isInlineBox(): boolean {
    return this.isBox && this.attr('type') === 'inline';
  }

  /**
   * A boolean value indicating whether the first node is a block box element.
   */
  public get isBlockBox(): boolean {
    return this.isBox && this.attr('type') === 'block';
  }

  /**
   * A boolean value indicating whether the first node is a contenteditable element where users can edit the content.
   */
  public get isContainer(): boolean {
    if (this.length === 0) {
      return false;
    }
    const node = this.get(0) as HTMLElement;
    return this.isElement && node.getAttribute('contenteditable') === 'true';
  }

  /**
   * A boolean value indicating whether the first node does not have an ancestor element which contenteditable attribute is true.
   */
  public get isOutside(): boolean {
    return this.closest('[contenteditable="true"]').length === 0;
  }

  /**
   * A boolean value indicating whether the first node has an ancestor element which contenteditable attribute is true.
   */
  public get isInside(): boolean {
    return !this.isOutside && !this.isContainer;
  }

  /**
   * A boolean value indicating whether the first node's parent element is an element which contenteditable attribute is true.
   */
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

  /**
   * A boolean value indicating whether the first node is editable.
   */
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

  /**
   * A boolean value indicating whether the first node is indivisible.
   */
  public get isIndivisible(): boolean {
    return this.isContainer || this.isTable;
  }

  /**
   * A boolean value indicating whether the first node is empty.
   */
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

  /**
   * Returns a native node at the specified index.
   */
  public get(index: number): Node {
    return this.nodeList[index];
  }

  /**
   * Returns all native nodes.
   */
  public getAll(): Node[] {
    return this.nodeList;
  }

  /**
   * Returns a new Nodes object that includes only the node at the specified index.
   */
  public eq(index: number): Nodes {
    const node = this.get(index);
    return new Nodes(node);
  }

  /**
   * Executes a provided function once for each node.
   */
  public each(callback: (node: Node, index: number) => boolean | void): this {
    const nodes = this.getAll();
    for (let i = 0; i < nodes.length; i++) {
      if (callback(nodes[i], i) === false) {
        return this;
      }
    }
    return this;
  }

  /**
   * Executes a provided function once for each element.
   */
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

  /**
   * Returns a new Nodes object with the nodes in reversed order.
   */
  public reverse(): Nodes {
    const nodes = this.getAll().reverse();
    return new Nodes(nodes);
  }

  /**
   * Tests whether the first node would be selected by the specified CSS selector.
   */
  public matches(selector: string): boolean {
    if (!this.isElement) {
      return false;
    }
    const element = this.get(0) as Element;
    return element.matches(selector);
  }

  /**
   * Returns a boolean value indicating whether the given node is a descendant of the first node,
   * that is the node itself, one of its direct children (childNodes), one of the children's direct children, and so on.
   */
  public contains(otherNode: Nodes): boolean {
    const element = this.get(0) as Element;
    return element.contains(otherNode.get(0));
  }

  /**
   * Returns a boolean value indicating whether the first node and a given node are siblings.
   */
  public isSibling(otherNode: Nodes): boolean {
    if (this.length === 0) {
      return false;
    }
    const parent = this.get(0).parentNode as HTMLElement;
    return parent && parent === otherNode.parent().get(0);
  }

  /**
   * Returns the descendants of the first node that match the specified CSS selector or node path.
   */
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

  /**
   * Traverses the first node and its parents (heading toward the document root) until it finds an element that matches the specified CSS selector.
   */
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

  /**
   * Traverses the first node and its parents until it finds a block element.
   */
  public closestBlock(): Nodes {
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

  /**
   * Traverses the first node and its parents until it finds an operable block.
   */
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

  /**
   * Traverses the first node and its parents until it finds a div element which contenteditable attribute is true.
   */
  public closestContainer(): Nodes {
    return this.closest('div[contenteditable="true"]');
  }

  /**
   * Traverses the first node and its parents until it finds an element which can scroll.
   */
  public closestScroller(): Nodes {
    let parent = this.eq(0);
    while (parent.length > 0) {
      if (parent.isElement && ['scroll', 'auto'].indexOf(parent.computedCSS('overflow-y')) >= 0) {
        return parent;
      }
      parent = parent.parent();
    }
    return new Nodes();
  }

  /**
   * Returns the parent of the first node.
   */
  public parent(): Nodes {
    const node = this.get(0);
    return new Nodes(node.parentNode);
  }

  /**
   * Returns the immediately preceding sibling of the first node.
   */
  public prev(): Nodes {
    const node = this.get(0);
    return new Nodes(node.previousSibling);
  }

  /**
   * Returns the immediately following sibling of the first node.
   */
  public next(): Nodes {
    const node = this.get(0);
    return new Nodes(node.nextSibling);
  }

  /**
   * Returns the first child of the first node.
   */
  public first(): Nodes {
    const element = this.get(0);
    return new Nodes(element.firstChild);
  }

  /**
   * Returns the last child of the first node.
   */
  public last(): Nodes {
    const element = this.get(0);
    return new Nodes(element.lastChild);
  }

  /**
   * Returns a number indicating the position of the first node relative to its sibling nodes.
   */
  public index(): number {
    let i = -1;
    let sibling: Node | null = this.get(0);
    while (sibling) {
      i++;
      sibling = sibling.previousSibling;
    }
    return i;
  }

  /**
   * Returns the path of the first node.
   */
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

  /**
   * Returns a list which contains all of the child nodes of the first node.
   */
  public children(): Nodes[] {
    const childList: Nodes[] = [];
    let child = this.first();
    while (child.length > 0) {
      childList.push(child);
      child = child.next();
    }
    return childList;
  }

  /**
   * Returns a generator that iterates over the descendants of the first node.
   */
  public* getWalker(): Generator<Nodes> {
    function* iterate(node: Nodes): Generator<Nodes> {
      if (node.isBox) {
        return;
      }
      let child = node.first();
      while (child.length > 0) {
        const nextNode = child.next();
        yield child;
        yield* iterate(child);
        child = nextNode;
      }
    }
    for (const node of iterate(this.eq(0))) {
      yield node;
    }
  }

  /**
   * Sets up an event listener for each element.
   */
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

  /**
   * Removes event listeners previously registered with on() method.
   */
  public off(type?: string, listener?: EventListener): this {
    return this.eachElement(element => {
      const elementId = element.lakeId;
      const eventItems = eventData[elementId] ?? [];
      for (let i = 0; i < eventItems.length; i++) {
        const item = eventItems[i];
        if (!type || (type === item.type && (!listener || listener === item.listener))) {
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

  /**
   * Executes all event listeners attached to all nodes for the given event type.
   */
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

  /**
   * Returns all event listeners attached to the node at the specified index.
   */
  public getEventListeners(index: number): EventItem[] {
    const elementId = this.get(index).lakeId;
    return eventData[elementId];
  }

  /**
   * Sets focus on the specified node, if it can be focused.
   */
  public focus(): this {
    const element = this.get(0) as HTMLElement;
    element.focus();
    return this;
  }

  /**
   * Removes focus from the specified node.
   */
  public blur(): this {
    const element = this.get(0) as HTMLElement;
    element.blur();
    return this;
  }

  /**
   * Returns a copy of the first node. If deep is true, the copy also includes the node's descendants.
   */
  public clone(deep = false): Nodes {
    const node = this.get(0);
    return new Nodes(node.cloneNode(deep));
  }

  /**
   * Returns a boolean value indicating whether the first node has the specified attribute or not.
   */
  public hasAttr(attributeName: string): boolean {
    const element = this.get(0) as Element;
    return element.hasAttribute(attributeName);
  }

  /**
   * Returns the value of the specified attribute from the first node, or sets the values of attributes for all elements.
   */
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

  /**
   * Removes the attribute with the specified name from every element.
   */
  public removeAttr(attributeName: string): this {
    return this.eachElement(element => {
      element.removeAttribute(attributeName);
    });
  }

  /**
   * Returns a boolean value indicating whether the first node has the specified class or not.
   */
  public hasClass(className: string): boolean {
    const element = this.get(0) as Element;
    return inString(element.className, className, ' ');
  }

  /**
   * Adds the given class to every element.
   */
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

  /**
   * Removes the given class from every element.
   */
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

  /**
   * Returns the value of the given CSS property of the first node,
   * after applying active stylesheets and resolving any basic computation this value may contain.
   */
  public computedCSS(propertyName: string): string {
    const element = this.get(0) as Element;
    return getCSS(element, propertyName);
  }

  /**
   * Returns the value of the given CSS property of the first node, or sets the values of CSS properties for all elements.
   */
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

  /**
   * Returns the width of of the first node.
   */
  public width(): number {
    const element = this.get(0) as HTMLElement;
    return element.offsetWidth;
  }

  /**
   * Returns the interior width of the first node, which does not include padding.
   */
  public innerWidth(): number {
    const paddingLeft = Number.parseInt(this.computedCSS('padding-left'), 10) || 0;
    const paddingRight = Number.parseInt(this.computedCSS('padding-right'), 10) || 0;
    return this.width() - paddingLeft - paddingRight;
  }

  /**
   * Returns the height of of the first node.
   */
  public height(): number {
    const element = this.get(0) as HTMLElement;
    return element.offsetHeight;
  }

  /**
   * Displays all nodes.
   */
  public show(displayType = 'block'): this {
    this.css('display', displayType);
    return this;
  }

  /**
   * Hides all nodes.
   */
  public hide(): this {
    this.css('display', 'none');
    return this;
  }

  /**
   * Returns the HTML string contained within the first node, or sets the HTML string for all elements.
   */
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

  /**
   * Returns the rendered text content of the first node, or sets the rendered text content for all elements.
   */
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

  /**
   * Returns the value of the first node, which must be an input element, or sets the value for all input elements.
   */
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

  /**
   * Returns the HTML string describing the first node including its descendants.
   */
  public outerHTML(): string {
    const element = this.get(0) as Element;
    return element.outerHTML;
  }

  /**
   * Removes all child nodes for each element.
   */
  public empty(): this {
    this.html('');
    return this;
  }

  /**
   * Inserts the specified content just inside the first node, before its first child.
   */
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

  /**
   * Inserts the specified content just inside the first node, after its last child.
   */
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

  /**
   * Inserts the specified content before the first node.
   */
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

  /**
   * Inserts the specified content after the first node.
   */
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

  /**
   * Replaces the first node with the given new content.
   */
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

  /**
   * Removes all nodes from the DOM.
   */
  public remove(keepChildren = false): this {
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

  /**
   * Splits the first node, which must be a text node, into two nodes at the specified offset, keeping both as siblings in the tree.
   */
  public splitText(offset: number): Nodes {
    if (!this.isText) {
      return new Nodes();
    }
    const node = this.get(0) as Text;
    const newNode = node.splitText(offset);
    return new Nodes(newNode);
  }

  /**
   * Returns information about the first node, which is used for debugging.
   */
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

  /**
   * Prints information about the first node, which is used for debugging.
   */
  public info(): void {
    debug(this.toString());
  }
}
