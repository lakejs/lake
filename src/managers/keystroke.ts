import { isKeyHotkey } from 'is-hotkey';
import { Nodes } from '../models/nodes';

type EventItem = {
  type: string;
  listener: (event: KeyboardEvent) => void | boolean;
};

export class Keystroke {
  private container: Nodes;

  private keydownEventList: EventItem[] = [];

  private keyupEventList: EventItem[] = [];

  constructor(container: Nodes) {
    this.container = container;
    this.container.on('keydown', event => {
      const keyboardEvent = event as KeyboardEvent;
      if (keyboardEvent.isComposing) {
        return;
      }
      if (keyboardEvent.defaultPrevented) {
        return;
      }
      for (const item of this.keydownEventList) {
        if (isKeyHotkey(item.type, keyboardEvent)) {
          if (item.listener(keyboardEvent) === false) {
            break;
          }
        }
      }
    });
    this.container.on('keyup', event => {
      const keyboardEvent = event as KeyboardEvent;
      if (keyboardEvent.isComposing) {
        return;
      }
      if (keyboardEvent.defaultPrevented) {
        return;
      }
      for (const item of this.keyupEventList) {
        if (isKeyHotkey(item.type, keyboardEvent)) {
          if (item.listener(keyboardEvent) === false) {
            break;
          }
        }
      }
    });
  }

  // Sets a keydown shortcut.
  public setKeydown(type: string, listener: EventListener): void {
    this.keydownEventList.push({
      type,
      listener,
    });
  }

  // Sets a keyup shortcut.
  public setKeyup(type: string, listener: EventListener): void {
    this.keyupEventList.push({
      type,
      listener,
    });
  }

  // Executes the keydown shortcuts.
  public keydown(type: string): void {
    for (const item of this.keydownEventList) {
      if (item.type === type) {
        if (item.listener(new KeyboardEvent(type)) === false) {
          break;
        }
      }
    }
  }

  // Executes the keyup shortcuts.
  public keyup(type: string): void {
    for (const item of this.keyupEventList) {
      if (item.type === type) {
        if (item.listener(new KeyboardEvent(type)) === false) {
          break;
        }
      }
    }
  }
}
