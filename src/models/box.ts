import { BoxData, BoxType, BoxValue } from '../types/box';
import { boxDataMap } from '../data/box';
import { encode } from '../utils/encode';
import { query } from '../utils/query';
import { Nodes } from './nodes';

const bodyTemplate = `
  <span class="box-strip"><br /></span>
    <div class="box-body" contenteditable="false"></div>
  <span class="box-strip"><br /></span>
`.replace(/^\s+/gm, '').replace(/\n/g, '');

export class Box {
  public node: Nodes;

  constructor(data: BoxData | Nodes) {
    if (data instanceof Nodes) {
      this.node = data;
    } else {
      const type = encode(data.type);
      const name = encode(data.name);
      this.node = query(`<lake-box type="${type}" name="${name}"></lake-box>`);
      if (data.value) {
        this.value = data.value;
      }
      this.node.html(bodyTemplate);
      boxDataMap.set(data.name, data);
    }
  }

  public get type(): BoxType {
    return this.node.attr('type') as BoxType;
  }

  public set type(type: BoxType) {
    this.node.attr('type', type);
  }

  public get name(): string {
    return this.node.attr('name');
  }

  public get value(): BoxValue {
    const value = this.node.attr('value');
    if (value === '') {
      return {};
    }
    return JSON.parse(atob(value));
  }

  public set value(value: BoxValue) {
    this.node.attr('value', btoa(JSON.stringify(value)));
  }

  public render(): void {
    const data = boxDataMap.get(this.name);
    if (data === undefined) {
      return;
    }
    if (this.node.find('.box-body').length === 0) {
      this.node.html(bodyTemplate);
    }
    const html = data.render(this.value);
    this.node.find('.box-body').html(html);
  }
}
