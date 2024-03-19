import type { Editor } from '../editor';
import { BoxComponent } from '../types/box';
import { boxes } from '../storage/boxes';
import { boxInstances } from '../storage/box-instances';
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

  public getInstances(editor: Editor): Map<number, Box> {
    let instanceMap = boxInstances.get(editor.container.id);
    if (!instanceMap) {
      instanceMap = new Map();
      boxInstances.set(editor.container.id, instanceMap);
      return instanceMap;
    }
    return instanceMap;
  }

  public rectifyInstances(editor: Editor) {
    const instanceMap = this.getInstances(editor);
    for (const box of instanceMap.values()) {
      if (!box.node.get(0).isConnected) {
        box.unmount();
        instanceMap.delete(box.node.id);
      }
    }
  }

  public findAll(editor: Editor): Nodes {
    return editor.container.find('lake-box');
  }

  public renderAll(editor: Editor): void {
    this.rectifyInstances(editor);
    const instanceMap = this.getInstances(editor);
    this.findAll(editor).each(boxNativeNode => {
      const boxNode = new Nodes(boxNativeNode);
      if (instanceMap.get(boxNode.id)) {
        return;
      }
      const box = new Box(boxNode);
      box.render();
      instanceMap.set(box.node.id, box);
    });
  }
}
