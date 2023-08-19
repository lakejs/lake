import EventEmitter from 'eventemitter3';
import pkg from '../package.json';
import { NativeElement } from './types/native';
import * as utils from './utils';
import * as models from './models';

import heading from './modules/heading';

const { query, forEach } = utils;

type TargetType = string | NativeElement;

type OptionsType = {[key: string]: any};

const defaultOptions: OptionsType = {
  className: 'lake-editor-container',
  defaultValue: '<p><anchor />foo<focus />bar</p>',
};

export default class LakeCore {
  static version: string = pkg.version;

  static utils = utils;

  static models = models;

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
    forEach(defaultOptions, (key, value) => {
      if (this.options[key] === undefined) {
        this.options[key] = value;
      }
    });
  }

  private addBuiltInModules() {
    const module = this.module;
    module.add(heading());
  }

  private normalizeSpecialTags(value: string) {
    return value.
      replace(/<anchor\s*\/>/ig, '<cursor type="anchor"></cursor>').
      replace(/<focus\s*\/>/ig, '<cursor type="focus"></cursor>').
      replace(/<cursor\s*\/>/ig, '<cursor type="cursor"></cursor>');
  }

  public create() {
    const targetNode = query(this.target);
    targetNode.hide();
    const className = this.options.className;
    const defaultValue = this.options.defaultValue;
    const containerNode = query('<div />');
    containerNode.attr({
      class: className,
      contenteditable: 'true',
    });
    containerNode.html(this.normalizeSpecialTags(defaultValue));
    targetNode.after(containerNode);
    this.module.runAll(this);
    this.event.emit('create');
  }
}
