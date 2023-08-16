import { debug } from '../utils/debug';
import { Range } from '../models/range';

export class Command {
  range: Range;

  constructor() {
    this.range = new Range();
  }

  add() {
    debug('add command');
  }

  run(...data: any[]) {
    debug('run command', data);
  }
}
