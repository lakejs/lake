import type { Editor } from '../editor';
import { BoxComponent } from '../types/box';
import { boxes } from '../storage/boxes';
import { Nodes } from '../models/nodes';
import { Box } from '../models/box';

export class BoxManager {
  public add(component: BoxComponent) {
    boxes.set(component.name, component);
  }

  public remove(name: string) {
    boxes.delete(name);
  }

  public getNames(): string[] {
    return Array.from(boxes.keys());
  }

  public findAll(editor: Editor): Nodes {
    return editor.container.find('lake-box');
  }

  public renderAll(editor: Editor) {
    this.findAll(editor).each(boxNode => {
      new Box(boxNode).render();
    });
  }
}
