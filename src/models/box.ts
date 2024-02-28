import { Base64 } from 'js-base64';
import type { Editor } from '../editor';
import { NativeNode } from '../types/native';
import { BoxType, BoxValue } from '../types/box';
import { boxes } from '../storage/boxes';
import { editors } from '../storage/editors';
import { safeTemplate } from '../utils/safe-template';
import { encode } from '../utils/encode';
import { query } from '../utils/query';
import { morph } from '../utils/morph';
import { Nodes } from './nodes';

type CleanupFunction = () => void;
type SetupFunction = () => CleanupFunction | void;

// Is a key-value object for storing data about box.
const boxData: { [key: number]: { [key: string]: any } } = {};

// Is a key-value object for storing all effects.
const effectData: { [key: number]: { setup: SetupFunction[], cleanup: CleanupFunction[] } } = {};

const framework = safeTemplate`
  <span class="lake-box-strip"><br /></span>
  <div class="lake-box-container" contenteditable="false"></div>
  <span class="lake-box-strip"><br /></span>
`;

export class Box {
  // <lake-box> element
  public node: Nodes;

  constructor(node: string | Nodes | NativeNode) {
    if (typeof node === 'string') {
      const component = boxes.get(node);
      if (component === undefined) {
        throw new Error(`Box '${node}' has not been defined yet.`);
      }
      const type = encode(component.type);
      const name = encode(component.name);
      this.node = query(`<lake-box type="${type}" name="${name}"></lake-box>`);
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
    }
    container.on('mouseenter', () => {
      if (container.hasClass('lake-box-selected') || container.hasClass('lake-box-activated')) {
        return;
      }
      container.addClass('lake-box-hovered');
    });
    container.on('mouseleave', () => {
      container.removeClass('lake-box-hovered');
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

  // Updates the value of the box.
  public set value(value: BoxValue) {
    this.node.attr('value', Base64.encode(JSON.stringify(value)));
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
    const container = this.node.closestContainer();
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
    for (const setup of effectData[this.node.id].setup) {
      const result = setup();
      if (result !== undefined) {
        effectData[this.node.id].cleanup.push(result);
      }
    }
    if (content === undefined) {
      return;
    }
    const container = this.getContainer();
    const newContainer = container.clone(false);
    newContainer.append(content);
    morph(container, newContainer);
  }

  // Destroys a rendered box.
  public unmount(): void {
    for (const cleanup of effectData[this.node.id].cleanup) {
      cleanup();
    }
    this.node.empty();
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
