import EventEmitter from 'eventemitter3';
import pkg from '../package.json';
import { NativeElement } from './types/native';
import * as utils from './utils';
import * as models from './models';

import heading from './modules/heading';

const { query } = utils;

type TargetType = string | NativeElement;

type OptionsType = {
  className: string,
};

const defaultOptions: OptionsType = {
  className: 'lake-editor-container',
};

export default class LakeCore {
  public version: string = pkg.version;

  public utils = utils;

  public models = models;

  private target: TargetType;

  private options: OptionsType;

  public event: EventEmitter;

  public command: models.Command;

  public module: models.Module;

  constructor(target: string | NativeElement, options?: OptionsType) {
    this.target = target;
    this.options = options || defaultOptions;
    this.setDefaultOptions();

    this.event = new EventEmitter();
    this.command = new models.Command();
    this.module = new models.Module();

    this.addBuiltInModules();
  }

  private setDefaultOptions() {
    this.options.className = this.options.className || defaultOptions.className;
  }

  private addBuiltInModules() {
    const module = this.module;
    module.add(heading());
  }

  public create() {
    const targetNode = query(this.target);
    targetNode.hide();
    const defaultValue = targetNode.html();
    const className = this.options.className;
    const containerNode = query('<div />');
    containerNode.attr({
      class: className,
      contenteditable: 'true',
    });
    containerNode.html(defaultValue);
    targetNode.after(containerNode);
    this.module.runAll(this);
    this.event.emit('create');
  }
}
