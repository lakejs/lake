import { createKeybindingsHandler } from 'tinykeys';
import { Nodes } from './nodes';

export class Keystroke {
  private container: Nodes;

  constructor(container: Nodes) {
    this.container = container;
  }

  public setKeydown(name: string, listener: EventListener) {
    const handler = createKeybindingsHandler({
      [name]: event => listener(event),
    });
    this.container.on('keydown', handler);
  }

  public setKeyup(name: string, listener: EventListener) {
    const handler = createKeybindingsHandler({
      [name]: event => listener(event),
    });
    this.container.on('keyup', handler);
  }
}
