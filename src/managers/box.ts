import type { Core } from '../core';
import { BoxDefinition } from '../types/box';
import { boxes } from '../storage/boxes';
import { Nodes } from '../models/nodes';
import { Box } from '../models/box';

export class BoxManager {
  public add(def: BoxDefinition) {
    boxes.set(def.name, def);
  }

  public getNames(): string[] {
    return Array.from(boxes.keys());
  }

  public getAllNodeList(editor: Core): Nodes[] {
    const nodeList: Nodes[] = [];
    editor.container.find('lake-box').each(node => {
      nodeList.push(new Nodes(node));
    });
    return nodeList;
  }

  public renderAll(editor: Core) {
    const boxNodeList = this.getAllNodeList(editor);
    for (const boxNode of boxNodeList) {
      new Box(boxNode).render();
    }
  }
}
