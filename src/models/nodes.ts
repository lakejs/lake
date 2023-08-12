import { NativeElement, NativeNode } from '../types/native';
import { forEach } from '../utils/for-each';
import { searchString } from '../utils/search-string';
import { camelCase } from '../utils/camel-case';
import { getCss } from '../utils/get-css';
import { getNodeList } from '../utils/get-node-list';

type EachCallback = (element: NativeNode, index: number) => boolean | void;
type EachElementCallback = (element: NativeElement, index: number) => boolean | void;

type EventItem = {
  type: string,
  listener: EventListener,
};

// eventData is a key-value object for storing all events.
// value is an array which include types and listeners.
const eventData: { [key: number]: EventItem[] } = {};

let lastElementId = 0;

export class Nodes {
  elementArray: NativeNode[];
  length: number;

  constructor(element: NativeNode | Array<NativeNode>) {
    this.elementArray = Array.isArray(element) ? element : [element];
    for (let i = 0; i < this.elementArray.length; i++) {
      // lakeId is an expando for preserving element ID.
      // https://developer.mozilla.org/en-US/docs/Glossary/Expando
      if (!this.elementArray[i].lakeId) {
        this.elementArray[i].lakeId = ++lastElementId;
      }
    }
    this.length = this.elementArray.length;
  }

  get(index: number): NativeNode {
    if (index === undefined) {
      index = 0;
    }
    return this.elementArray[index];
  }

  getAll(): NativeNode[] {
    return this.elementArray;
  }

  isElement(index: number): boolean {
    const element = this.get(index);
    return element.nodeType === NativeNode.ELEMENT_NODE;
  }

  isText(index: number): boolean {
    const element = this.get(index);
    return element.nodeType === NativeNode.TEXT_NODE;
  }

  eq(index: number): Nodes {
    const element = this.get(index);
    return new Nodes(element);
  }

  id(index: number): number {
    const element = this.get(index);
    return element.lakeId;
  }

  name(index: number): string {
    const element = this.get(index);
    return element.nodeName.toLowerCase();
  }

  each(callback: EachCallback): this {
    const elements = this.getAll();
    for (let i = 0; i < elements.length; i++) {
      if (callback(elements[i], i) === false) {
        return this;
      }
    }
    return this;
  }

  eachElement(callback: EachElementCallback): this {
    const elements = this.getAll();
    for (let i = 0; i < elements.length; i++) {
      if (elements[i].nodeType === NativeNode.ELEMENT_NODE) {
        if (callback(elements[i] as NativeElement, i) === false) {
          return this;
        }
      }
    }
    return this;
  }

  on(type: string, listener: EventListener): this {
    return this.eachElement((element, index) => {
      element.addEventListener(type, listener, false);
      const elementId = this.id(index);
      if (!eventData[elementId]) {
        eventData[elementId] = [];
      }
      eventData[elementId].push({
        type,
        listener,
      });
    });
  }

  off(type?: string, listener?: EventListener): this {
    return this.eachElement((element, index) => {
      const elementId = this.id(index);
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
      eventData[elementId] = eventItems.filter((item: EventItem) => {
        return item.type !== '';
      });
    });
  }

  fire(type: string): this {
    return this.eachElement((element, index) => {
      const elementId = this.id(index);
      const eventItems = eventData[elementId];
      eventItems.forEach((item: EventItem) => {
        if (type === item.type) {
          item.listener.call(element, new Event(type));
        }
      });
    });
  }

  getEventListeners(index: number) {
    const elementId = this.id(index);
    return eventData[elementId];
  }

  hasAttr(attributeName: string): boolean {
    const element = this.get(0) as NativeElement;
    return element.hasAttribute(attributeName);
  }

  attr(attributeName: string | { [key: string]: string }, value?: string): string | this {
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

  removeAttr(attributeName: string): this {
    return this.eachElement(element => {
      element.removeAttribute(attributeName);
    });
  }

  hasClass(className: string): boolean {
    const element = this.get(0) as NativeElement;
    return searchString(element.className, className, ' ');
  }

  addClass(className: string | string[]): this {
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

  removeClass(className: string | string[]): this {
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

  css(propertyName: string | { [key: string]: string }, value?: string): string | this {
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

  html(value?: string): string | this {
    if (value === undefined) {
      const element = this.get(0) as NativeElement;
      return element.innerHTML;
    }
    return this.eachElement(element => {
      element.innerHTML = value;
    });
  }

  empty(): this {
    this.html('');
    return this;
  }

  prepend(value: string | NativeNode | Nodes): this {
    return this.eachElement(element => {
      let list: NativeNode[] = [];
      if (value instanceof Nodes) {
        list = value.getAll();
      } else {
        list = getNodeList(value);
      }
      if (element.firstChild) {
        list = list.reverse();
      }
      list.forEach((node: NativeNode) => {
        if (element.firstChild) {
          element.insertBefore(node, element.firstChild);
        } else {
          element.appendChild(node);
        }
      });
    });
  }

  append(value: string | NativeNode | Nodes): this {
    return this.eachElement(element => {
      let list: NativeNode[] = [];
      if (value instanceof Nodes) {
        list = value.getAll();
      } else {
        list = getNodeList(value);
      }
      list.forEach((node: NativeNode) => {
        element.appendChild(node);
      });
    });
  }

  appendTo(value: string | NativeElement | Nodes): this {
    return this.each(node => {
      let newNodes: Nodes;
      if (value instanceof Nodes) {
        newNodes = value;
      } else {
        const list = getNodeList(value);
        newNodes = new Nodes(list);
      }
      newNodes.append(node);
    });
  }

  remove(keepChildren: boolean = false): this {
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
}
