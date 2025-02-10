import EventEmitter from 'eventemitter3';
import type { Editor } from '../editor';
import { BoxType, BoxValue } from '../types/box';
import { ToolbarItem } from '../types/toolbar';
import { boxes } from '../storage/boxes';
import { editors } from '../storage/editors';
import { debug } from '../utils/debug';
import { template } from '../utils/template';
import { encode } from '../utils/encode';
import { toBase64 } from '../utils/to-base64';
import { fromBase64 } from '../utils/from-base64';
import { query } from '../utils/query';
import { Nodes } from './nodes';
import { FloatingToolbar } from '../ui/floating-toolbar';

// The Box interface represents an embedded content, which is used to enhance editing capability.
export class Box {
  // A lake-box element to which the contents of the box are appended.
  public readonly node: Nodes;

  // An EventEmitter object used to set up events.
  public readonly event: EventEmitter = new EventEmitter();

  // A toolbar for the box.
  public toolbar: FloatingToolbar | null = null;

  constructor(node: string | Node | Nodes) {
    if (typeof node === 'string') {
      const component = boxes.get(node);
      if (component === undefined) {
        throw new Error(`Box "${node}" has not been defined yet.`);
      }
      const type = encode(component.type);
      const name = encode(component.name);
      this.node = query(template`<lake-box type="${type}" name="${name}"></lake-box>`);
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

  private initiate(): void {
    let container = this.getContainer();
    if (container.length === 0) {
      this.node.html(template`
        <span class="lake-box-strip"><br /></span>
        <div class="lake-box-container" contenteditable="false"></div>
        <span class="lake-box-strip"><br /></span>
      `);
      container = this.getContainer();
    } else {
      container.off('mouseenter');
      container.off('mouseleave');
      container.off('click');
    }
    container.on('mouseenter', () => {
      if (
        container.hasClass('lake-box-selected')
        || container.hasClass('lake-box-focused')
        || container.hasClass('lake-box-activated')
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

  // Sets part of the value of the box.
  public updateValue(keyName: string, keyValue: string): void;

  public updateValue(keyName: BoxValue): void;

  public updateValue(keyName: any, keyValue?: any): void {
    const value = this.value;
    if (typeof keyName === 'string') {
      value[keyName] = keyValue;
    } else {
      for (const key of Object.keys(keyName)) {
        value[key] = keyName[key];
      }
    }
    this.value = value;
  }

  // Returns an Editor object that contains the box.
  public getEditor(): Editor {
    const container = this.node.closest('div[contenteditable]');
    const editor = container.length > 0 ? editors.get(container.id) : undefined;
    if (!editor) {
      throw new Error(`Box "${this.name}" (id=${this.node.id}) is not rendered in the editor.`);
    }
    return editor;
  }

  // Returns the container of the box.
  public getContainer(): Nodes {
    return this.node.find('.lake-box-container');
  }

  // Returns the HTML string contained within the box.
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

  // Sets a floating toolbar for the box.
  public setToolbar(items: ToolbarItem[]): void {
    const editor = this.getEditor();
    this.event.on('focus', () => {
      if (this.toolbar) {
        this.toolbar.unmount();
      }
      this.toolbar = new FloatingToolbar({
        target: this.node,
        items,
      });
      this.toolbar.render();
      const activeItems = editor.selection.getActiveItems();
      this.toolbar.updateState({
        activeItems,
      });
      this.event.emit('renderfloatingtoolbar');
    });
    this.event.on('blur', () => {
      if (this.toolbar) {
        this.toolbar.unmount();
        this.toolbar = null;
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
    this.initiate();
    const content = component.render(this);
    if (content !== undefined) {
      const container = this.getContainer();
      container.empty();
      container.append(content);
    }
    debug(`Box "${this.name}" (id: ${this.node.id}) rendered`);
  }

  // Destroys the box.
  public unmount(): void {
    this.event.emit('blur');
    this.event.emit('beforeunmount');
    this.event.removeAllListeners();
    this.node.empty();
    debug(`Box "${this.name}" (id: ${this.node.id}) unmounted`);
  }
}
