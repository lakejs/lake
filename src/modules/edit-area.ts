import EventEmitter from 'eventemitter3';
import { NativeElement } from '../types/native';
import { debug } from '../utils';
import { query } from '../models';

export class EditArea {
  event: EventEmitter;

  constructor(target: string | NativeElement, options: {[key: string]: string | boolean} = {}) {
    this.event = new EventEmitter();
    const nodes = query(target);
    nodes.hide();
    const defaultValue = nodes.html() as string;
    const className = options.className as string || 'lake-editor-area';
    const editAreaElement = query('<div></div>');
    editAreaElement.attr({
      class: className,
      contenteditable: 'true',
    });
    editAreaElement.html(defaultValue);
    nodes.after(editAreaElement);

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
