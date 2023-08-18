import EventEmitter from 'eventemitter3';
import pkg from '../package.json';
import { NativeElement } from './types/native';
import * as utils from './utils';
import * as models from './models';

import heading from './modules/heading';

const { query, debug } = utils;

type TargetType = string | NativeElement;

type OptionsType = {[key: string]: string | boolean};

const module = new models.Module();
module.add(heading());

export default class LakeCore {
  version: string = pkg.version;

  utils = utils;

  models = models;

  target: TargetType;

  options: OptionsType;

  event: EventEmitter;

  command: models.Command;

  constructor(target: string | NativeElement, options: OptionsType = {}) {
    this.target = target;
    this.options = options;
    this.event = new EventEmitter();
    this.command = new models.Command();
    this.event.on('create', value => {
      debug(value, 1);
    });
  }

  create() {
    const targetNode = query(this.target);
    targetNode.hide();
    const defaultValue = targetNode.html();
    const className = this.options.className as string || 'lake-editor-area';
    const containerNode = query('<div></div>');
    containerNode.attr({
      class: className,
      contenteditable: 'true',
    });
    containerNode.html(defaultValue);
    targetNode.after(containerNode);

    module.run(this);
  }
}
