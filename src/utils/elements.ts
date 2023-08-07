import { forEach } from './for-each';
import { getDocument } from './get-document';
import { getWindow } from './get-window';

type EachCallback = (element: Element, index: number) => boolean | void;

type EventItem = {
  type: string,
  callback: EventListener,
};

type EventItemArray = Array<EventItem>;

export class Elements {
  elements: Array<Element>;
  events: Array<EventItemArray>;
  length: number;
  doc: Document;
  win: Window;

  constructor(element: Element | Array<Element>) {
    this.elements = Array.isArray(element) ? element : [element];
    this.events = [];
    for (let i = 0; i < this.elements.length; i++) {
      this.events[i] = [];
    }
    this.length = this.elements.length;
    const firstElement =  this.elements[0];
    this.doc = getDocument(firstElement);
    this.win = getWindow(firstElement);
  }

  get(index: number): Elements {
    return new Elements(this.elements[index]);
  }

  each(callback: EachCallback): this {
    for (let i = 0; i < this.elements.length; i++) {
      if (callback(this.elements[i], i) === false) {
        return this;
      }
    }
    return this;
  }

  name(): string {
    return this.elements[0].nodeName.toLowerCase();
  }

  on(type: string, callback: EventListener): this {
    return this.each((element, index) => {
      element.addEventListener(type, callback, false);
      this.events[index].push({
        type,
        callback,
      });
    });
  }

  off(type?: string, callback?: EventListener): this {
    return this.each((element, index) => {
      const eventItems = this.events[index];
      eventItems.forEach((item, index) => {
        if (!type || type === item.type && (!callback || callback === item.callback)) {
          element.removeEventListener(item.type, item.callback, false);
          eventItems[index] = {
            type: '',
            callback: () => {},
          };
        }
      });
      this.events[index] = eventItems.filter(item => {
        return item.type !== '';
      });
    });
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
