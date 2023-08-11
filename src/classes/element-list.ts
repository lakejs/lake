import { NativeElement, NativeNode } from '../types/native';
import { forEach } from '../utils/for-each';
import { searchString } from '../utils/search-string';
import { camelCase } from '../utils/camel-case';
import { getDocument } from '../utils/get-document';
import { getWindow } from '../utils/get-window';
import { getCss } from '../utils/get-css';
import { getFragment } from '../utils/get-fragment';

type EachCallback = (element: NativeElement, index: number) => boolean | void;

type EventItemType = {
  type: string,
  listener: EventListener,
};

// eventData is a nested array for storing all events which include types and listeners.
const eventData: { [key: number]: EventItemType[] } = {};

let lastElementId = 0;

export class ElementList {
  elementArray: Array<NativeElement>;
  length: number;
  doc: Document;
  win: Window;

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
    this.doc = getDocument(this.elementArray[0]);
    this.win = getWindow(this.elementArray[0]);
  }

  get(index: number): NativeElement {
    if (index === undefined) {
      index = 0;
    }
    return this.elementArray[index];
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
    for (let i = 0; i < this.elementArray.length; i++) {
      if (callback(this.elementArray[i], i) === false) {
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
      const eventItems = eventData[elementId];
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

  append(value: string | NativeNode): this {
    return this.each(element => {
      if (element.appendChild) {
        const fragment = getFragment(value);
        element.appendChild(fragment);
      }
    });
  }
}
