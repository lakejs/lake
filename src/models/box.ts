import { Base64 } from 'js-base64';
import EventEmitter from 'eventemitter3';
import type { Editor } from '../editor';
import { NativeNode } from '../types/native';
import { BoxType, BoxValue } from '../types/box';
import { boxes } from '../storage/boxes';
import { editors } from '../storage/editors';
import { debug } from '../utils/debug';
import { safeTemplate } from '../utils/safe-template';
import { encode } from '../utils/encode';
import { query } from '../utils/query';
import { morph } from '../utils/morph';
import { Nodes } from './nodes';

type CleanupFunction = () => void;
type SetupFunction = () => CleanupFunction | void;

// A key-value object for storing data about box.
const boxData: { [key: number]: { [key: string]: any } } = {};

// A key-value object for storing all effects.
const effectData: { [key: number]: { setup: SetupFunction[], cleanup: CleanupFunction[] } } = {};

const framework = safeTemplate`
  <span class="lake-box-strip"><br /></span>
  <div class="lake-box-container" contenteditable="false" draggable="true"></div>
  <span class="lake-box-strip"><br /></span>
`;

export class Box {
  // <lake-box> element
  public node: Nodes;

  public event: EventEmitter = new EventEmitter();

  constructor(node: string | Nodes | NativeNode) {
    if (typeof node === 'string') {
      const component = boxes.get(node);
      if (component === undefined) {
        throw new Error(`Box '${node}' has not been defined yet.`);
      }
      const type = encode(component.type);
      const name = encode(component.name);
      this.node = query(safeTemplate`<lake-box type="${type}" name="${name}"></lake-box>`);
      if (component.value) {
        this.value = component.value;
      }
    } else {
      this.node = query(node);
      const component = boxes.get(this.name);
      if (component === undefined) {
        throw new Error(`Box '${this.name}' has not been defined yet.`);
      }
      if (component.value && !this.node.hasAttr('value')) {
        this.value = component.value;
      }
    }
    if (!boxData[this.node.id]) {
      boxData[this.node.id] = {};
    }
    if (!effectData[this.node.id]) {
      effectData[this.node.id] = {
        setup: [],
        cleanup: [],
      };
    }
  }

  // Adds the framework of the box.
  private addFramework(): void {
    let container = this.getContainer();
    if (container.length === 0) {
      this.node.html(framework);
      container = this.getContainer();
    } else {
      container.off('mouseenter');
      container.off('mouseleave');
      container.off('click');
    }
    container.on('mouseenter', () => {
      if (
        container.hasClass('lake-box-selected') ||
        container.hasClass('lake-box-focused') ||
        container.hasClass('lake-box-activated')
      ) {
        return;
      }
      container.addClass('lake-box-hovered');
    });
    container.on('mouseleave', () => {
      container.removeClass('lake-box-hovered');
    });
    container.on('click', () => {
      debug(`Box '${this.name}' (id = ${this.node.id}) value:`);
      debug(this.value);
    });
  }

  // Returns the type of the box.
  public get type(): BoxType {
    return this.node.attr('type') as BoxType;
  }

  // Returns the name of the box.
  public get name(): string {
    return this.node.attr('name');
  }

  // Returns the value of the box.
  public get value(): BoxValue {
    const value = this.node.attr('value');
    if (value === '') {
      return {};
    }
    return JSON.parse(Base64.decode(value));
  }

  // Sets the value of the box.
  public set value(value: BoxValue) {
    this.node.attr('value', Base64.encode(JSON.stringify(value)));
  }

  // Updates part of the value of the box.
  public updateValue(valueKey: string, valueValue: string): void;

  public updateValue(valueKey: BoxValue): void;

  public updateValue(valueKey: any, valueValue?: any): void {
    const value = this.value;
    if (typeof valueKey === 'string') {
      value[valueKey] = valueValue;
    } else {
      for (const key of Object.keys(valueKey)) {
        value[key] = valueKey[key];
      }
    }
    this.value = value;
  }

  // Returns data of the box.
  public getData(key: string): any {
    return boxData[this.node.id][key];
  }

  // Updates data of the box.
  public setData(key: string, value: any): void {
    boxData[this.node.id][key] = value;
  }

  // Returns the editor instance of the box.
  public getEditor(): Editor | undefined {
    const container = this.node.closest('div[contenteditable]');
    return container.length > 0 ? editors.get(container.id) : undefined;
  }

  // Returns the container node of the box.
  public getContainer(): Nodes {
    return this.node.find('.lake-box-container');
  }

  public useEffect(setup: SetupFunction): void {
    effectData[this.node.id].setup.push(setup);
  }

  // Renders the contents of the box.
  public render(): void {
    effectData[this.node.id].setup = [];
    effectData[this.node.id].cleanup = [];
    const component = boxes.get(this.name);
    if (component === undefined) {
      return;
    }
    this.addFramework();
    const content = component.render(this);
    if (content !== undefined) {
      const container = this.getContainer();
      const newContainer = container.clone(false);
      newContainer.append(content);
      morph(container, newContainer);
    }
    for (const setup of effectData[this.node.id].setup) {
      const result = setup();
      if (result !== undefined) {
        effectData[this.node.id].cleanup.push(result);
      }
    }
    debug(`Box '${this.name}' (id = ${this.node.id}) rendered`);
  }

  // Destroys a rendered box.
  public unmount(): void {
    for (const cleanup of effectData[this.node.id].cleanup) {
      cleanup();
    }
    boxData[this.node.id] = {};
    effectData[this.node.id].setup = [];
    effectData[this.node.id].cleanup = [];
    this.event.removeAllListeners();
    this.node.empty();
    debug(`Box '${this.name}' (id = ${this.node.id}) unmounted`);
  }

  // Returns a HTML string of the box.
  public getHTML(): string {
    const component = boxes.get(this.name);
    if (component === undefined) {
      return '';
    }
    if (component.html === undefined) {
      return this.node.outerHTML();
    }
    return component.html(this);
  }
}
