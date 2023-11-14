import EventEmitter from 'eventemitter3';
import { debug } from '../utils/debug';

export class Figure {

  public event: EventEmitter;

  constructor() {
    this.event = new EventEmitter();
  }

  public render() {
    debug('render method');
  }

}
