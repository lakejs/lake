import EventEmitter from 'eventemitter3';
import { debug } from '../utils/debug';

type CommandHandler = (...data: any[]) => void;

export class Command {
  private commandMap: { [key: string]: CommandHandler };

  public event: EventEmitter;

  constructor() {
    this.commandMap = {};
    this.event = new EventEmitter();
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
    this.event.emit('execute:before', name);
    handler.apply(this, data);
    this.event.emit('execute', name);
    debug(`executed command '${name}'`);
  }
}
