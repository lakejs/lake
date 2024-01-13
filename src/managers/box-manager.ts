import type { Core } from '../core';
import { BoxComponent } from '../types/box';
import { boxes } from '../storage/boxes';
import { Nodes } from '../models/nodes';
import { Box } from '../models/box';

export class BoxManager {
  public add(def: BoxComponent) {
    boxes.set(def.name, def);
  }

  public remove(name: string) {
    boxes.delete(name);
  }

  public getNames(): string[] {
    return Array.from(boxes.keys());
  }

  public getNodeList(editor: Core): Nodes[] {
    const nodeList: Nodes[] = [];
    editor.container.find('lake-box').each(node => {
      nodeList.push(new Nodes(node));
    });
    return nodeList;
  }

  public renderAll(editor: Core) {
    const boxNodeList = this.getNodeList(editor);
    for (const boxNode of boxNodeList) {
      new Box(boxNode).render();
    }
  }
}
