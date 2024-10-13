import EventEmitter from 'eventemitter3';
import type { Editor } from '../editor';
import { BoxType, BoxValue } from '../types/box';
import { FloatingToolbarItem } from '../types/floating-toolbar';
import { boxes } from '../storage/boxes';
import { editors } from '../storage/editors';
import { debug } from '../utils/debug';
import { safeTemplate } from '../utils/safe-template';
import { encode } from '../utils/encode';
import { toBase64 } from '../utils/to-base64';
import { fromBase64 } from '../utils/from-base64';
import { query } from '../utils/query';
import { Nodes } from './nodes';
import { Range } from './range';
import { FloatingToolbar } from '../ui/floating-toolbar';

const framework = safeTemplate`
  <span class="lake-box-strip"><br /></span>
  <div class="lake-box-container" contenteditable="false"></div>
  <span class="lake-box-strip"><br /></span>
`;

export class Box {
  // <lake-box> element
  public node: Nodes;

  public event: EventEmitter = new EventEmitter();

  constructor(node: string | Node | Nodes) {
    if (typeof node === 'string') {
      const component = boxes.get(node);
      if (component === undefined) {
        throw new Error(`Box "${node}" has not been defined yet.`);
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
        throw new Error(`Box "${this.name}" has not been defined yet.`);
      }
      if (component.value && !this.node.hasAttr('value')) {
        this.value = component.value;
      }
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
      debug(`Box "${this.name}" (id = ${this.node.id}) value:`);
      debug(this.value);
    });
    if (this.type === 'block' && this.node.isContentEditable) {
      container.attr('draggable', 'true');
    }
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
    return JSON.parse(fromBase64(value));
  }

  // Sets the value of the box.
  public set value(value: BoxValue) {
    this.node.attr('value', toBase64(JSON.stringify(value)));
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

  // Returns an instance of the editor that includes the box.
  public getEditor(): Editor {
    const container = this.node.closest('div[contenteditable]');
    const editor = container.length > 0 ? editors.get(container.id) : undefined;
    if (!editor) {
      throw new Error(`Box "${this.name}" (id=${this.node.id}) is not rendered in the editor.`);
    }
    return editor;
  }

  // Returns the container node of the box.
  public getContainer(): Nodes {
    return this.node.find('.lake-box-container');
  }

  // Sets a popup toolbar for the box.
  public setToolbar(items: FloatingToolbarItem[]): void {
    let editor: Editor | undefined;
    try {
      editor = this.getEditor();
    } catch { /* empty */ }
    let toolbar: FloatingToolbar | null = null;
    this.event.on('focus', () => {
      if (toolbar) {
        toolbar.unmount();
      }
      const range = new Range();
      range.selectNodeContents(this.node);
      range.info();
      toolbar = new FloatingToolbar({
        range,
        items,
        locale: editor ? editor.locale : undefined,
      });
      toolbar.render();
      if (editor) {
        const appliedItems = editor.selection.getAppliedItems();
        toolbar.updateState(appliedItems);
      }
    });
    this.event.on('blur', () => {
      if (toolbar) {
        toolbar.unmount();
        toolbar = null;
      }
    });
  }

  // Renders the contents of the box.
  public render(): void {
    const component = boxes.get(this.name);
    if (component === undefined) {
      return;
    }
    this.event.emit('beforeunmount');
    this.event.removeAllListeners();
    this.addFramework();
    const content = component.render(this);
    if (content !== undefined) {
      const container = this.getContainer();
      container.empty();
      container.append(content);
    }
    debug(`Box "${this.name}" (id: ${this.node.id}) rendered`);
  }

  // Destroys a rendered box.
  public unmount(): void {
    this.event.emit('blur');
    this.event.emit('beforeunmount');
    this.event.removeAllListeners();
    this.node.empty();
    debug(`Box "${this.name}" (id: ${this.node.id}) unmounted`);
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
