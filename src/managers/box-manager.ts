import { BoxComponent } from '../types/box';
import { boxes } from '../storage/boxes';
import { boxInstances } from '../storage/box-instances';
import { query } from '../utils/query';
import { getBox } from '../utils/get-box';
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

  public getInstances(container: Nodes): Map<number, Box> {
    let instanceMap = boxInstances.get(container.id);
    if (!instanceMap) {
      instanceMap = new Map();
      boxInstances.set(container.id, instanceMap);
      return instanceMap;
    }
    return instanceMap;
  }

  public rectifyInstances(container: Nodes) {
    const instanceMap = this.getInstances(container);
    for (const box of instanceMap.values()) {
      if (!box.node.get(0).isConnected) {
        box.unmount();
        instanceMap.delete(box.node.id);
      }
    }
  }

  public renderAll(container: Nodes): void {
    this.rectifyInstances(container);
    const instanceMap = this.getInstances(container);
    container.find('lake-box').each(boxNativeNode => {
      const boxNode = query(boxNativeNode);
      if (instanceMap.get(boxNode.id)) {
        return;
      }
      const box = getBox(boxNode);
      box.render();
    });
  }
}
