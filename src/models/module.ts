import { debug } from '../utils/debug';

export class Module {

  constructor() {
    debug('command constructor');
  }

  add() {
    debug('add command');
  }

  run(...data: any[]) {
    debug('run command', data);
  }
}
