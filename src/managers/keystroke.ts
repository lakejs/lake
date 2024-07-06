import { isKeyHotkey } from 'is-hotkey';
import { Nodes } from '../models/nodes';

type EventItem = {
  type: string;
  listener: (event: KeyboardEvent) => void | boolean;
};

const aliasMap = new Map([
  ['arrow-left', 'left'],
  ['arrow-right', 'right'],
  ['arrow-up', 'up'],
  ['arrow-down', 'down'],
]);

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
      for (const item of this.keyupEventList) {
        if (isKeyHotkey(item.type, keyboardEvent)) {
          if (item.listener(keyboardEvent) === false) {
            break;
          }
        }
      }
    });
  }

  private normalizeType(type: string) {
    type = aliasMap.get(type) ?? type;
    return type;
  }

  // Sets a keydown shortcut.
  public setKeydown(type: string, listener: EventListener) {
    type = this.normalizeType(type);
    this.keydownEventList.push({
      type,
      listener,
    });
  }

  // Sets a keyup shortcut.
  public setKeyup(type: string, listener: EventListener) {
    type = this.normalizeType(type);
    this.keyupEventList.push({
      type,
      listener,
    });
  }

  // Executes the keydown shortcuts.
  public keydown(type: string) {
    type = this.normalizeType(type);
    for (const item of this.keydownEventList) {
      if (item.type === type) {
        if (item.listener(new KeyboardEvent(type)) === false) {
          break;
        }
      }
    }
  }

  // Executes the keyup shortcuts.
  public keyup(type: string) {
    type = this.normalizeType(type);
    for (const item of this.keyupEventList) {
      if (item.type === type) {
        if (item.listener(new KeyboardEvent(type)) === false) {
          break;
        }
      }
    }
  }
}
