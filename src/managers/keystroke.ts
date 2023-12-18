import { createKeybindingsHandler } from 'tinykeys';
import { NativeEvent } from '../types/native';
import { camelCase } from '../utils/camel-case';
import { Nodes } from '../models/nodes';

type EventItem = {
  type: string,
  listener: EventListener,
};

const shortenedTypeMap = new Map([
  ['#', 'shift+#'],
]);

export class Keystroke {
  private container: Nodes;

  private keydownEventList: EventItem[];

  private keyupEventList: EventItem[];

  constructor(container: Nodes) {
    this.container = container;
    this.keydownEventList = [];
    this.keyupEventList = [];
  }

  private normalizeType(type: string) {
    type = shortenedTypeMap.get(type) ?? type;
    type = type.replace(/(^|\+|\s)mod(\+|\s|$)/g, '$1$mod$2').
      replace(/shift|control|alt|meta|enter|tab|backspace|delete|space|escape|arrow-left|arrow-right|arrow-up|arrow-down/,
        (match: string) => match.charAt(0).toUpperCase() + camelCase(match.substring(1))).
      replace(/(^|\+|\s)([a-z])(\+|\s|$)/g,
        (match: string, p1: string, p2: string, p3: string) => `${p1}Key${p2.toUpperCase()}${p3}`);
    return type;
  }

  // Sets a keydown shortcut.
  public setKeydown(type: string, listener: EventListener) {
    type = this.normalizeType(type);
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
    type = this.normalizeType(type);
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
    type = this.normalizeType(type);
    for (const item of this.keydownEventList) {
      if (item.type === type) {
        item.listener(new NativeEvent(type));
      }
    }
  }

  // Executes the keyup shortcuts.
  public keyup(type: string) {
    type = this.normalizeType(type);
    for (const item of this.keyupEventList) {
      if (item.type === type) {
        item.listener(new NativeEvent(type));
      }
    }
  }
}
