import type { Editor } from '../editor';
import { BoxComponent } from '../types/box';
import { boxes } from '../storage/boxes';
import { Nodes } from '../models/nodes';
import { Box } from '../models/box';

export class BoxManager {
  private instances: Map<number, Map<number, Box>>;

  constructor() {
    this.instances = new Map();
  }

  public add(component: BoxComponent) {
    boxes.set(component.name, component);
  }

  public remove(name: string) {
    boxes.delete(name);
  }

  public getNames(): string[] {
    return Array.from(boxes.keys());
  }

  public getInstances(editor: Editor): Map<number, Box> {
    let map = this.instances.get(editor.container.id);
    if (!map) {
      map = new Map();
      this.instances.set(editor.container.id, map);
      return map;
    }
    return map;
  }

  public rectifyInstances(editor: Editor) {
    const map = this.getInstances(editor);
    for (const box of map.values()) {
      if (!box.node.get(0).isConnected) {
        box.unmount();
        map.delete(box.node.id);
      }
    }
  }

  public findAll(editor: Editor): Nodes {
    return editor.container.find('lake-box');
  }

  public renderAll(editor: Editor): void {
    const map = this.getInstances(editor);
    this.findAll(editor).each(boxNativeNode => {
      const box = new Box(boxNativeNode);
      box.render();
      map.set(box.node.id, box);
    });
  }
}
