import type { Core } from '../core';
import { Box as BoxItem } from '../types/box';
import { Nodes } from '../models/nodes';

export class Box {
  private boxMap: Map<string, BoxItem>;

  constructor() {
    this.boxMap = new Map();
  }

  public add(box: BoxItem) {
    this.boxMap.set(box.name, box);
  }

  public render(boxNode: Nodes): void {
    const name = boxNode.attr('name');
    const box = this.boxMap.get(name);
    if (box === undefined) {
      return;
    }
    const html = `
      <span class="box-strip"><br /></span>
        <div class="box-body" contenteditable="false">${box.render(box.value)}</div>
      <span class="box-strip"><br /></span>
    `;
    boxNode.html(html);
  }

  public renderAll(editor: Core) {
    editor.container.find('lake-box').each(node => {
      const boxNode = new Nodes(node);
      this.render(boxNode);
    });
  }
}
