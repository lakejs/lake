import { forEach } from './for-each';
import { searchString } from './search-string';
import { getDocument } from './get-document';
import { getWindow } from './get-window';

type EachCallback = (domElement: Element, index: number) => boolean | void;

type EventItemType = {
  type: string,
  callback: EventListener,
};

// eventData is a nested array for storing all events which include types and listeners.
const eventData: Array<Array<EventItemType>> = [];

let lastElementId = 0;

export class ElementList {
  domElementArray: Array<Element>;
  length: number;
  doc: Document;
  win: Window;

  constructor(domElement: Element | Array<Element>) {
    this.domElementArray = Array.isArray(domElement) ? domElement : [domElement];
    for (let i = 0; i < this.domElementArray.length; i++) {
      // lake-id is an expando for preserving element ID.
      // https://developer.mozilla.org/en-US/docs/Glossary/Expando
      if (!this.domElementArray[i]['lake-id']) {
        this.domElementArray[i]['lake-id'] = ++lastElementId;
      }
    }
    this.length = this.domElementArray.length;
    this.doc = getDocument(this.domElementArray[0]);
    this.win = getWindow(this.domElementArray[0]);
  }

  get(index: number): Element {
    if (index === undefined) {
      index = 0;
    }
    return this.domElementArray[index];
  }

  eq(index: number): ElementList {
    const domElement = this.get(index);
    return new ElementList(domElement);
  }

  id(index: number): string {
    const domElement = this.get(index);
    return domElement['lake-id'];
  }

  name(index: number): string {
    const domElement = this.get(index);
    return domElement.nodeName.toLowerCase();
  }

  each(callback: EachCallback): this {
    for (let i = 0; i < this.domElementArray.length; i++) {
      if (callback(this.domElementArray[i], i) === false) {
        return this;
      }
    }
    return this;
  }

  on(type: string, callback: EventListener): this {
    return this.each((domElement, index) => {
      domElement.addEventListener(type, callback, false);
      const elementId = this.id(index);
      if (!eventData[elementId]) {
        eventData[elementId] = [];
      }
      eventData[elementId].push({
        type,
        callback,
      });
    });
  }

  off(type?: string, callback?: EventListener): this {
    return this.each((domElement, index) => {
      const elementId = this.id(index);
      const eventItems = eventData[elementId];
      eventItems.forEach((item: EventItemType, index: number) => {
        if (!type || type === item.type && (!callback || callback === item.callback)) {
          domElement.removeEventListener(item.type, item.callback, false);
          eventItems[index] = {
            type: '',
            callback: () => {},
          };
        }
      });
      eventData[elementId] = eventItems.filter(item => {
        return item.type !== '';
      });
    });
  }

  fire(type: string): this {
    return this.each((domElement, index) => {
      const elementId = this.id(index);
      const eventItems = eventData[elementId];
      eventItems.forEach((item: EventItemType) => {
        if (type === item.type) {
          item.callback.call(domElement, new Event(type));
        }
      });
    });
  }

  getEventListeners(index: number) {
    const elementId = this.id(index);
    return eventData[elementId];
  }

  hasAttr(name: string): boolean {
    const domElement = this.get(0);
    return domElement.hasAttribute(name);
  }

  attr(name: string | object, value?: string): string | this {
    if (typeof name === 'object') {
      forEach(name, (k, v) => {
        this.attr(k, v);
      });
      return this;
    }
    if (value === undefined) {
      const domElement = this.get(0);
      return domElement.getAttribute(name) || '';
    }
    return this.each(domElement => {
      domElement.setAttribute(name, value);
    });
  }

  removeAttr(name: string): this {
    return this.each(domElement => {
      domElement.removeAttribute(name);
    });
  }

  hasClass(className: string): boolean {
    const domElement = this.get(0);
    return searchString(domElement.className, className, ' ');
  }

  addClass(className: string): this {
    return this.each(domElement => {
      domElement.classList.add(className);
    });
    return this;
  }

  removeClass(className: string): this {
    return this.each(domElement => {
      domElement.classList.remove(className);
      if (domElement.className === '') {
        domElement.removeAttribute('class');
      }
    });
    return this;
  }
}
