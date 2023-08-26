import { NativeHTMLElement, NativeElement, NativeNode } from '../types/native';
import { forEach } from '../utils/for-each';
import { inString } from '../utils/in-string';
import { camelCase } from '../utils/camel-case';
import { getCss } from '../utils/get-css';
import { toNodeList } from '../utils/to-node-list';
import { debug } from '../utils/debug';

const blockTagNames = 'h1,h2,h3,h4,h5,h6,div,p,blockquote,ul,ol';
const markTagNames = 'strong,em,span,sub,sup,code,a';

type EachCallback = (element: NativeNode, index: number) => boolean | void;
type EachElementCallback = (element: NativeElement, index: number) => boolean | void;

type EventItem = {
  type: string,
  listener: EventListener,
};

// eventData is a key-value object for storing all events.
// value is an array which include types and listeners.
const eventData: { [key: number]: EventItem[] } = {};

let lastNodeId = 0;

export class Nodes {
  // Returns native nodes that includes element, text node.
  private nodeList: NativeNode[];

  // Represents the number of nodes in nodeList.
  public length: number;

  constructor(node?: NativeNode | NativeNode[] | null) {
    node = node || [];
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

  // Gets node ID at the first index.
  public get id(): number {
    const node = this.get(0);
    return node.lakeId;
  }

  // Gets node name at the first index.
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
    return inString(blockTagNames, this.name);
  }

  // Returns a boolean value indicating whether the node is a mark element.
  public get isMark(): boolean {
    if (this.length === 0) {
      return false;
    }
    return inString(markTagNames, this.name);
  }

  // Returns a boolean value indicating whether the node is editable.
  public get isEditable(): boolean {
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
    return element.isContentEditable && element.getAttribute('contenteditable') !== 'true';
  }

  // Returns a boolean value indicating whether the node is an editable top node.
  public get isTopEditable(): boolean {
    if (this.length === 0) {
      return false;
    }
    const parent = this.get(0).parentNode as NativeHTMLElement;
    if (!parent) {
      return false;
    }
    return this.isEditable && parent.getAttribute('contenteditable') === 'true';
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
    const element = this.get(0) as NativeElement;
    return new Nodes(element.lastChild);
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
      const eventItems = eventData[elementId] || [];
      eventItems.forEach((item: EventItem, index: number) => {
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
      eventItems.forEach((item: EventItem) => {
        if (type === item.type) {
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

  public hasAttr(attributeName: string): boolean {
    const element = this.get(0) as NativeElement;
    return element.hasAttribute(attributeName);
  }

  public attr(attributeName: string): string;

  public attr(attributeName: string, value: string): this;

  public attr(attributeName: { [key: string]: string }): this;

  public attr(attributeName: any, value?: any): any {
    if (typeof attributeName === 'object') {
      forEach(attributeName, (name, val) => {
        this.attr(name, val);
      });
      return this;
    }
    if (value === undefined) {
      const element = this.get(0) as NativeElement;
      return element.getAttribute(attributeName) || '';
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

  public css(propertyName: string): string;

  public css(propertyName: { [key: string]: string }): this;

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
      return getCss(element, propertyName);
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

  // Inserts each node as the first child of the target.
  public prependTo(target: string | NativeElement | Nodes): this {
    const nodes = this.getAll();
    for (let i = nodes.length - 1; i >= 0; i--) {
    // for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      let targetNode: Nodes;
      if (target instanceof Nodes) {
        targetNode = target;
      } else {
        const list = toNodeList(target);
        targetNode = new Nodes(list);
      }
      targetNode.prepend(node);
    }
    return this;
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

  // Inserts each node as the last child of the target.
  public appendTo(target: string | NativeElement | Nodes): this {
    return this.each(node => {
      let targetNode: Nodes;
      if (target instanceof Nodes) {
        targetNode = target;
      } else {
        const list = toNodeList(target);
        targetNode = new Nodes(list);
      }
      targetNode.append(node);
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

  // Prints information of each node.
  public debug(): void {
    this.each(node => {
      debug(`node (${node.lakeId}): `, node);
    });
  }
}
