import type { Core } from '../core';
import { BoxData } from '../types/box';
import { boxDataMap } from '../data/box';
import { Nodes } from '../models/nodes';
import { Box as BoxModel } from '../models/box';

export class Box {
  public add(data: BoxData) {
    boxDataMap.set(data.name, data);
  }

  public renderAll(editor: Core) {
    editor.container.find('lake-box').each(node => {
      const boxNode = new Nodes(node);
      const box = new BoxModel(boxNode);
      box.render();
    });
  }
}
