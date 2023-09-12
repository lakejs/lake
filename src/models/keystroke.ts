import { createKeybindingsHandler } from 'tinykeys';
import { Nodes } from './nodes';

type EventItem = {
  type: string,
  listener: EventListener,
};

export class Keystroke {
  private container: Nodes;

  private keydownEventList: EventItem[];

  private keyupEventList: EventItem[];

  constructor(container: Nodes) {
    this.container = container;
    this.keydownEventList = [];
    this.keyupEventList = [];
  }

  // Sets a keydown shortcut.
  public setKeydown(type: string, listener: EventListener) {
    const handler = createKeybindingsHandler({
      [type]: event => listener(event),
    });
    this.keydownEventList.push({
      type,
      listener,
    });
    this.container.on('keydown', handler);
  }

  // Sets a keyup shortcut.
  public setKeyup(type: string, listener: EventListener) {
    const handler = createKeybindingsHandler({
      [type]: event => listener(event),
    });
    this.keyupEventList.push({
      type,
      listener,
    });
    this.container.on('keyup', handler);
  }

  // Executes the keydown shortcuts.
  public keydown(type: string) {
    for (const item of this.keydownEventList) {
      if (item.type === type) {
        item.listener(new Event(type));
      }
    }
  }

  // Executes the keyup shortcuts.
  public keyup(type: string) {
    for (const item of this.keyupEventList) {
      if (item.type === type) {
        item.listener(new Event(type));
      }
    }
  }
}
