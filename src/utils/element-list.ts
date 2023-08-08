import { forEach } from './for-each';
import { searchString } from './search-string';
import { camelCase } from './camel-case';
import { getDocument } from './get-document';
import { getWindow } from './get-window';

type EachCallback = (domElement: Element, index: number) => boolean | void;

type EventItemType = {
  type: string,
  listener: EventListener,
};

function rgbToHex(value: string): string {
  const hex = (value: string): string => {
    const hexString = window.parseInt(value, 10).toString(16).toLowerCase();
    return hexString.length > 1 ? hexString : '0' + hexString;
  };
  return value.replace(/rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*\d+\s*)?\)/ig, ($0, $1, $2, $3) => {
    return '#' + hex($1) + hex($2) + hex($3);
  });
}

function getComputedCss(domElement: Element, propertyName: string): string {
  const win = getWindow(domElement);
  const camelPropertyName = camelCase(propertyName);
  const computedStyle = win.getComputedStyle(domElement, null);
  return computedStyle[camelPropertyName] || computedStyle.getPropertyValue(propertyName) || domElement['style'][camelPropertyName];
}

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

  on(type: string, listener: EventListener): this {
    return this.each((domElement, index) => {
      domElement.addEventListener(type, listener, false);
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
    return this.each((domElement, index) => {
      const elementId = this.id(index);
      const eventItems = eventData[elementId];
      eventItems.forEach((item: EventItemType, index: number) => {
        if (!type || type === item.type && (!listener || listener === item.listener)) {
          domElement.removeEventListener(item.type, item.listener, false);
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
    return this.each((domElement, index) => {
      const elementId = this.id(index);
      const eventItems = eventData[elementId];
      eventItems.forEach((item: EventItemType) => {
        if (type === item.type) {
          item.listener.call(domElement, new Event(type));
        }
      });
    });
  }

  getEventListeners(index: number) {
    const elementId = this.id(index);
    return eventData[elementId];
  }

  hasAttr(attributeName: string): boolean {
    const domElement = this.get(0);
    return domElement.hasAttribute(attributeName);
  }

  attr(attributeName: string | object, value?: string): string | this {
    if (typeof attributeName === 'object') {
      forEach(attributeName, (name, val) => {
        this.attr(name, val);
      });
      return this;
    }
    if (value === undefined) {
      const domElement = this.get(0);
      return domElement.getAttribute(attributeName) || '';
    }
    return this.each(domElement => {
      domElement.setAttribute(attributeName, value);
    });
  }

  removeAttr(attributeName: string): this {
    return this.each(domElement => {
      domElement.removeAttribute(attributeName);
    });
  }

  hasClass(className: string): boolean {
    const domElement = this.get(0);
    return searchString(domElement.className, className, ' ');
  }

  addClass(className: string | string[]): this {
    if (Array.isArray(className)) {
      className.forEach(name => {
        this.addClass(name);
      });
      return this;
    }
    return this.each(domElement => {
      domElement.classList.add(className);
    });
  }

  removeClass(className: string | string[]): this {
    if (Array.isArray(className)) {
      className.forEach(name => {
        this.removeClass(name);
      });
      return this;
    }
    return this.each(domElement => {
      domElement.classList.remove(className);
      if (domElement.className === '') {
        domElement.removeAttribute('class');
      }
    });
    return this;
  }

  css(propertyName: string | object, value?: string): string | this {
    if (typeof propertyName === 'object') {
      forEach(propertyName, (name, val) => {
        this.css(name, val);
      });
      return this;
    }
    if (value === undefined) {
      const domElement = this.get(0);
      const propertyValue = domElement['style'][camelCase(propertyName)] || getComputedCss(domElement, propertyName) || '';
      return rgbToHex(propertyValue);
    }
    return this.each(domElement => {
      domElement['style'][camelCase(propertyName)] = value;
    });
  }
}
