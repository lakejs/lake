import { debug } from '../utils/debug';

type CommandHandler = (...data: any[]) => boolean | void;
type CommandData = { [key: string]: CommandHandler };

export class Command {
  private data: CommandData;

  constructor() {
    this.data = {};
  }

  add(name: string, handler: CommandHandler) {
    this.data[name] = handler;
    debug('add command');
  }

  run(name: string, ...data: any[]) {
    const handler = this.data[name];
    if (!handler) {
      throw new Error(`Handler '${name}' does not exist.`);
    }
    handler.apply(this, data);
  }
}
