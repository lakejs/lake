import { BoxComponent } from '../types/box';
import { boxes } from '../storage/boxes';

// The BoxManager interface provides methods to manage a collection of BoxComponent objects.
export class BoxManager {
  // Adds a BoxComponent to the collection.
  public add(component: BoxComponent): void {
    boxes.set(component.name, component);
  }

  // Removes a box component from the collection by its name.
  public remove(name: string): void {
    boxes.delete(name);
  }

  // Returns a list of all box component names in the collection.
  public getNames(): string[] {
    return Array.from(boxes.keys());
  }
}
