import { debug } from '../utils/debug';

type CommandHandler = (...data: any[]) => void;

export class Command {
  private commandMap: { [key: string]: CommandHandler };

  constructor() {
    this.commandMap = {};
  }

  public add(name: string, handler: CommandHandler) {
    this.commandMap[name] = handler;
    debug(`added command '${name}'`);
  }

  public execute(name: string, ...data: any[]) {
    const handler = this.commandMap[name];
    if (!handler) {
      throw new Error(`Command '${name}' doesn't exist.`);
    }
    handler.apply(this, data);
    debug(`executed command '${name}'`);
  }
}
