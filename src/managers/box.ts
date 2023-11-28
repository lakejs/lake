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

  public renderAll(editor: Core) {
    editor.container.find('lake-box').each(node => {
      const boxNode = new Nodes(node);
      const box = new Box(boxNode);
      box.render();
    });
  }
}
