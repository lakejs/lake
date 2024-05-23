import { BoxComponent } from '../types/box';
import { boxes } from '../storage/boxes';

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
}
