import { forEach } from './for-each';
import { getDocument } from './get-document';
import { getWindow } from './get-window';

type EachCallback = (element: Element, index: number) => boolean | void;

type EventItemType = {
  type: string,
  callback: EventListener,
};

const eventData: Array<Array<EventItemType>> = [];

let lastElementId = 0;

export class Elements {
  elements: Array<Element>;
  length: number;
  doc: Document;
  win: Window;

  constructor(element: Element | Array<Element>) {
    this.elements = Array.isArray(element) ? element : [element];
    for (let i = 0; i < this.elements.length; i++) {
      // lake-id is an expando for preserving element ID.
      // https://developer.mozilla.org/en-US/docs/Glossary/Expando
      if (!this.elements[i]['lake-id']) {
        this.elements[i]['lake-id'] = ++lastElementId;
      }
    }
    this.length = this.elements.length;
    this.doc = getDocument(this.elements[0]);
    this.win = getWindow(this.elements[0]);
  }

  get(index?: number): Elements {
    if (index === undefined) {
      index = 0;
    }
    return new Elements(this.elements[index]);
  }

  id(index?: number): string {
    if (index === undefined) {
      index = 0;
    }
    return this.elements[index]['lake-id'];
  }

  name(index?: number): string {
    if (index === undefined) {
      index = 0;
    }
    return this.elements[index].nodeName.toLowerCase();
  }

  each(callback: EachCallback): this {
    for (let i = 0; i < this.elements.length; i++) {
      if (callback(this.elements[i], i) === false) {
        return this;
      }
    }
    return this;
  }

  on(type: string, callback: EventListener): this {
    return this.each((element, index) => {
      element.addEventListener(type, callback, false);
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
    return this.each((element, index) => {
      const elementId = this.id(index);
      const eventItems = eventData[elementId];
      eventItems.forEach((item: EventItemType, index: number) => {
        if (!type || type === item.type && (!callback || callback === item.callback)) {
          element.removeEventListener(item.type, item.callback, false);
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
    return this.each((element, index) => {
      const elementId = this.id(index);
      const eventItems = eventData[elementId];
      eventItems.forEach((item: EventItemType) => {
        if (type === item.type) {
          item.callback.call(element, new Event(type));
        }
      });
    });
  }

  getEventListeners(index?: number) {
    const elementId = this.id(index);
    return eventData[elementId];
  }

  attr(key: string | object, value?: string): string | this {
    if (typeof key === 'object') {
      forEach(key, (k, v) => {
        this.attr(k, v);
      });
      return this;
    }
    if (value === undefined) {
      return this.elements[0].getAttribute(key) || '';
    }
    return this.each(element => {
      element.setAttribute(key, value);
    });
  }

  removeAttr(key: string): this {
    return this.each(element => {
      element.removeAttribute(key);
    });
  }
}
