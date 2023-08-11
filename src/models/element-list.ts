import { NativeElement, NativeNode } from '../types/native';
import { forEach } from '../utils/for-each';
import { searchString } from '../utils/search-string';
import { camelCase } from '../utils/camel-case';
import { getCss } from '../utils/get-css';
import { getNodeList } from '../utils/get-node-list';

type EachCallback = (element: NativeElement, index: number) => boolean | void;

type EventItemType = {
  type: string,
  listener: EventListener,
};

// eventData is a nested array for storing all events which include types and listeners.
const eventData: { [key: number]: EventItemType[] } = {};

let lastElementId = 0;

export class ElementList {
  elementArray: NativeElement[];
  length: number;

  constructor(element: NativeElement | Array<NativeElement>) {
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

  get(index: number): NativeElement {
    if (index === undefined) {
      index = 0;
    }
    return this.elementArray[index];
  }

  getAll(): NativeElement[] {
    return this.elementArray;
  }

  eq(index: number): ElementList {
    const element = this.get(index);
    return new ElementList(element);
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

  on(type: string, listener: EventListener): this {
    return this.each((element, index) => {
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
    return this.each((element, index) => {
      const elementId = this.id(index);
      const eventItems = eventData[elementId] || [];
      eventItems.forEach((item: EventItemType, index: number) => {
        if (!type || type === item.type && (!listener || listener === item.listener)) {
          element.removeEventListener(item.type, item.listener, false);
          eventItems[index] = {
            type: '',
            listener: () => {},
          };
        }
      });
      eventData[elementId] = eventItems.filter((item: EventItemType) => {
        return item.type !== '';
      });
    });
  }

  fire(type: string): this {
    return this.each((element, index) => {
      const elementId = this.id(index);
      const eventItems = eventData[elementId];
      eventItems.forEach((item: EventItemType) => {
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
    const element = this.get(0);
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
      const element = this.get(0);
      return element.getAttribute(attributeName) || '';
    }
    return this.each(element => {
      element.setAttribute(attributeName, value);
    });
  }

  removeAttr(attributeName: string): this {
    return this.each(element => {
      element.removeAttribute(attributeName);
    });
  }

  hasClass(className: string): boolean {
    const element = this.get(0);
    return searchString(element.className, className, ' ');
  }

  addClass(className: string | string[]): this {
    if (Array.isArray(className)) {
      className.forEach(name => {
        this.addClass(name);
      });
      return this;
    }
    return this.each(element => {
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
    return this.each(element => {
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
      const element = this.get(0);
      return getCss(element, propertyName);
    }
    return this.each(element => {
      element.style[camelCase(propertyName)] = value;
    });
  }

  html(value?: string): string | this {
    if (value === undefined) {
      const element = this.get(0);
      return element.innerHTML;
    }
    return this.each(element => {
      element.innerHTML = value;
    });
  }

  empty(): this {
    this.html('');
    return this;
  }

  prepend(value: string | NativeNode | ElementList): this {
    return this.each(element => {
      let list: NativeNode[] = [];
      if (value instanceof ElementList) {
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

  append(value: string | NativeNode | ElementList): this {
    return this.each(element => {
      let list: NativeNode[] = [];
      if (value instanceof ElementList) {
        list = value.getAll();
      } else {
        list = getNodeList(value);
      }
      list.forEach((node: NativeNode) => {
        element.appendChild(node);
      });
    });
  }

  appendTo(value: string | NativeElement | ElementList): this {
    return this.each(element => {
      let newElementList: ElementList;
      if (value instanceof ElementList) {
        newElementList = value;
      } else {
        const list = getNodeList(value);
        newElementList = new ElementList(list as NativeElement[]);
      }
      newElementList.append(element);
    });
  }

  remove(keepChildren: boolean = false): this {
    this.each(element => {
      if (!element.parentNode) {
        return;
      }
      if (keepChildren) {
        let child = element.firstChild;
        while (child) {
          const next = child.nextSibling;
          element.parentNode.insertBefore(child, element);
          child = next;
        }
      }
      element.parentNode.removeChild(element);
    });
    return this;
  }
}
