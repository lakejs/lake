import { debug } from '../utils/debug';

export class Module {

  constructor() {

  }

  add() {
    debug('add command');
  }

  run(...data: any[]) {
    debug('run command', data);
  }
}
