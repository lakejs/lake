import EventEmitter from 'eventemitter3';
import { debug } from '../utils/debug';

type CommandHandler = (...data: any[]) => void;

export class Command {
  private commandMap: Map<string, CommandHandler>;

  public event: EventEmitter;

  constructor() {
    this.commandMap = new Map();
    this.event = new EventEmitter();
  }

  public add(name: string, handler: CommandHandler) {
    this.commandMap.set(name, handler);
  }

  public getNames(): string[] {
    return Array.from(this.commandMap.keys());
  }

  public execute(name: string, ...data: any[]) {
    const handler = this.commandMap.get(name);
    if (handler === undefined) {
      throw new Error(`Command '${name}' does not exist.`);
    }
    this.event.emit('beforeexecute', name);
    handler.apply(this, data);
    this.event.emit('execute', name);
    debug(`Command '${name}' executed`);
  }
}
