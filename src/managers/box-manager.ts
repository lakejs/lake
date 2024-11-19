import { BoxComponent } from '../types/box';
import { boxes } from '../storage/boxes';

export class BoxManager {
  public add(component: BoxComponent): void {
    boxes.set(component.name, component);
  }

  public remove(name: string): void {
    boxes.delete(name);
  }

  public getNames(): string[] {
    return Array.from(boxes.keys());
  }
}
