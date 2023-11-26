import type { Core } from '../core';
import { BoxDefinition } from '../types/box';
import { boxes } from '../storage/boxes';
import { Nodes } from '../models/nodes';
import { Box as BoxModel } from '../models/box';

export class Box {
  public add(def: BoxDefinition) {
    boxes.set(def.name, def);
  }

  public renderAll(editor: Core) {
    editor.container.find('lake-box').each(node => {
      const boxNode = new Nodes(node);
      const box = new BoxModel(boxNode);
      box.render();
    });
  }
}
