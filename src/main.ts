import EventEmitter from 'eventemitter3';
import pkg from '../package.json';
import { NativeElement } from './types/native';
import * as utils from './utils';
import * as models from './models';

import heading from './modules/heading';

const { query, forEach } = utils;
const { Selection } = models;

type TargetType = string | NativeElement;

type OptionsType = {[key: string]: any};

const containerClassName = 'lake-editor-container';

const defaultOptions: OptionsType = {
  className: '',
  defaultValue: '<p><anchor />foo<focus />bar</p>',
};

export default class LakeCore {
  static version: string = pkg.version;

  static utils = utils;

  static models = models;

  private target: TargetType;

  private container: models.Nodes;

  private options: OptionsType;

  private range: models.Range;

  private selection: models.Selection;

  public event: EventEmitter;

  public command: models.Command;

  public module: models.Module;

  constructor(target: string | NativeElement, options?: OptionsType) {
    this.target = target;
    this.options = options || defaultOptions;
    this.container = query('<div />');

    this.setDefaultOptions();
    this.addContainerAttributes();

    this.event = new EventEmitter();
    this.selection = new Selection();
    this.range = this.selection.getRange();
    this.command = new models.Command();
    this.module = new models.Module();

    this.addBuiltInModules();
  }

  private setDefaultOptions(): void {
    forEach(defaultOptions, (key, value) => {
      if (this.options[key] === undefined) {
        this.options[key] = value;
      }
    });
  }

  private addContainerAttributes(): void {
    const container = this.container;
    container.attr({
      class: containerClassName,
      contenteditable: 'true',
    });
    container.addClass(this.options.className);
  }

  private addBuiltInModules(): void {
    const module = this.module;
    module.add(heading());
  }

  private normalizeSpecialTags(value: string): string {
    return value.
      replace(/<anchor\s*\/>/ig, '<cursor type="anchor"></cursor>').
      replace(/<focus\s*\/>/ig, '<cursor type="focus"></cursor>').
      replace(/<cursor\s*\/>/ig, '<cursor type="cursor"></cursor>');
  }

  public focus(): void {
    const container = this.container;
    const anchorNode = container.find('cursor[type="anchor"]');
    const focusNode = container.find('cursor[type="focus"]');
    this.range.setStartAfter(anchorNode);
    anchorNode.remove();
    this.range.setEndAfter(focusNode);
    focusNode.remove();
    this.selection.addRange(this.range);
    container.focus();
  }

  public create(): void {
    const container = this.container;
    const targetNode = query(this.target);
    targetNode.hide();
    const defaultValue = this.options.defaultValue;
    container.html(this.normalizeSpecialTags(defaultValue));
    targetNode.after(container);
    this.focus();
    this.module.runAll(this);
    this.event.emit('create');
  }
}