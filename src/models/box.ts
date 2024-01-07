import { NativeNode } from '../types/native';
import { BoxType, BoxValue } from '../types/box';
import { boxes } from '../storage/boxes';
import { encode } from '../utils/encode';
import { query } from '../utils/query';
import { diff } from '../utils/diff';
import { Nodes } from './nodes';

const structure = `
  <span class="lake-box-strip"><br /></span>
  <div class="lake-box-container" contenteditable="false"></div>
  <span class="lake-box-strip"><br /></span>
`.replace(/^\s+/gm, '').replace(/\n/g, '');

export class Box {
  // <lake-box> element
  public node: Nodes;

  constructor(node: string | Nodes | NativeNode) {
    if (typeof node === 'string') {
      const def = boxes.get(node);
      if (def === undefined) {
        throw new Error(`Box '${node}' has not been defined yet.`);
      }
      const type = encode(def.type);
      const name = encode(def.name);
      this.node = query(`<lake-box type="${type}" name="${name}"></lake-box>`);
      if (def.value) {
        this.value = def.value;
      }
    } else {
      this.node = query(node);
      const def = boxes.get(this.name);
      if (def === undefined) {
        throw new Error(`Box '${this.name}' has not been defined yet.`);
      }
      if (def.value && !this.node.hasAttr('value')) {
        this.value = def.value;
      }
    }
  }

  // Renders the structure of the box.
  private renderStructure(): void {
    let container = this.getContainer();
    if (container.length === 0) {
      this.node.html(structure);
      container = this.getContainer();
    } else {
      container.off('mouseenter');
      container.off('mouseleave');
    }
    container.on('mouseenter', () => {
      if (container.hasClass('lake-box-selected')) {
        return;
      }
      container.addClass('lake-box-hovered');
    });
    container.on('mouseleave', () => {
      if (!container.hasClass('lake-box-hovered')) {
        return;
      }
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
    return JSON.parse(atob(value));
  }

  // Updates the value of the box.
  public set value(value: BoxValue) {
    this.node.attr('value', btoa(JSON.stringify(value)));
  }

  // Returns the container node of the box.
  public getContainer(): Nodes {
    return this.node.find('.lake-box-container');
  }

  // Sets focus on the box.
  public focus(): void {
    const container = this.getContainer();
    container.addClass('lake-box-selected');
  }

  // Removes focus from the editor area.
  public blur(): void {
    const container = this.getContainer();
    container.removeClass('lake-box-selected');
  }

  // Renders the contents of the box.
  public render(): void {
    const def = boxes.get(this.name);
    if (def === undefined) {
      return;
    }
    this.renderStructure();
    const content = def.render(this.value);
    const container = this.getContainer();
    const newContainer = container.clone(false);
    newContainer.html(content);
    diff(container, newContainer);
  }

  // Updates the value of the box and refreshes the container of the box.
  public update(value: BoxValue): void {
    this.value = value;
    this.render();
  }

  // Removes the box.
  public remove(): void {
    this.node.remove();
  }
}
