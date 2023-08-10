import EventEmitter from 'eventemitter3';
import { debug } from '../utils';

export class EditArea {
  event: EventEmitter;

  constructor() {
    this.event = new EventEmitter();
    this.event.on('create', value => {
      debug(value, 1);
    });
    this.event.on('remove', value => {
      debug(value, 2);
    });
  }

  create() {
    this.event.emit('create', 'EditArea is created');
  }

  remove() {
    this.event.emit('remove', 'EditArea is removed');
  }
}
