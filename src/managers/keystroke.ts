import { isKeyHotkey } from 'is-hotkey';
import { Nodes } from '../models/nodes';

interface EventItem {
  type: string;
  listener: (event: KeyboardEvent) => void | boolean;
}

// The Keystroke interface provides a way to handle keyboard events and define custom shortcuts for a given container.
export class Keystroke {
  private readonly container: Nodes;

  private readonly keydownEventList: EventItem[] = [];

  private readonly keyupEventList: EventItem[] = [];

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

  // Registers a keydown event listener for the specified key combination.
  public setKeydown(type: string, listener: EventListener): void {
    this.keydownEventList.push({
      type,
      listener,
    });
  }

  // Registers a keyup event listener for the specified key combination.
  public setKeyup(type: string, listener: EventListener): void {
    this.keyupEventList.push({
      type,
      listener,
    });
  }

  // Triggers all keydown event listeners associated with the specified key combination.
  public keydown(type: string): void {
    for (const item of this.keydownEventList) {
      if (item.type === type) {
        if (item.listener(new KeyboardEvent(type)) === false) {
          break;
        }
      }
    }
  }

  // Triggers all keyup event listeners associated with the specified key combination.
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
