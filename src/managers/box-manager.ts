import { BoxComponent } from '../types/box';
import { boxes } from '../storage/boxes';
import { getInstanceMap } from '../storage/box-instances';
import { query } from '../utils/query';
import { getBox } from '../utils/get-box';
import { Nodes } from '../models/nodes';

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

  public rectifyInstances(container: Nodes) {
    const instanceMap = getInstanceMap(container.id);
    for (const box of instanceMap.values()) {
      if (!box.node.get(0).isConnected) {
        box.unmount();
        instanceMap.delete(box.node.id);
      }
    }
  }

  public renderAll(container: Nodes): void {
    this.rectifyInstances(container);
    const instanceMap = getInstanceMap(container.id);
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
