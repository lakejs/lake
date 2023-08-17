import EventEmitter from 'eventemitter3';
import pkg from '../package.json';
import { NativeElement } from './types/native';
import utils from './utils';
import { Command } from './models';
import heading from './modules/heading';

const { query, debug, } = utils;

type TargetType = string | NativeElement;
type OptionsType = {[key: string]: string | boolean};

export default class LakeCore {
  version: string = pkg.version;
  utils = utils;
  target: TargetType;
  options: OptionsType;
  event: EventEmitter;
  command: Command;

  constructor(target: string | NativeElement, options: OptionsType = {}) {
    this.target = target;
    this.options = options;
    this.event = new EventEmitter();
    this.command = new Command();
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
    heading().initialize(this);
  }
}
